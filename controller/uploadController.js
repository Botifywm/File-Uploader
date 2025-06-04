const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

async function getSignUp(req, res) {
  res.render("signup");
}

async function createSignUp(req, res) {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userAdded = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  });
  console.log(userAdded);
  res.redirect("/");
}

async function getLogin(req, res) {
  res.render("login");
}

function loginPost(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.session.loginError = info.message;
      return res.redirect("/"); // Add custom message if needed
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/explorer");
    });
  })(req, res, next);
}

async function getLogOut(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid", { path: "/" });
      res.redirect("/");
    });
  });
}

async function getfileExplorerRoot(req, res) {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      folders: { where: { parentId: null } },
      files: { where: { folderId: null } },
    },
  });
  const parentList = [];

  // console.log("fileExplorer", userAll);
  res.render("root", { user, parentList: parentList });
}

async function uploadFile(req, res) {
  // console.log("FILE: ", req);
  const { originalname, size, path } = req.file;
  const userId = req.user.id;
  const folderId = req.body.folderId || null;

  await prisma.file.create({
    data: {
      name: originalname,
      size,
      path,
      userId: userId,
      folderId: folderId,
    },
  });

  if (folderId) {
    res.redirect(`/folder/${folderId}`);
  } else {
    res.redirect("/explorer");
  }
}

async function createFolder(req, res) {
  const parentId = req.body.parentId;
  // console.log(parentId);

  await prisma.folder.create({
    data: {
      name: req.body.folderName,
      userId: req.user.id,
      parentId: parentId ? parentId : null,
    },
  });

  if (parentId) {
    res.redirect(`/folder/${parentId}`);
  } else {
    res.redirect("/explorer");
  }
}

async function getFolder(req, res) {
  const folderId = req.params.id;
  const userId = req.user.id;
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    include: {
      children: true,
      files: true,
    },
  });

  const userAll = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      folders: true,
    },
  });

  let parentList = [];
  let fId = folderId;
  while (fId !== null) {
    userAll.folders.forEach((folder) => {
      if (fId === folder.id) {
        parentList.push({ name: folder.name, Id: folder.id });
        fId = folder.parentId;
      }
    });
  }

  parentList.reverse();

  res.render("folderExplorer", { folder: folder, parentList: parentList });
}

async function downloadFile(req, res) {
  const fileId = parseInt(req.params.id);
  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });
  if (!file) return res.status(404).send("File not found");
  if (!file.path) return res.status(404).send("File not found on server");

  res.download(file.path, file.name);
}

async function deleteFile(req, res) {
  const fileId = parseInt(req.params.id);
  const delFile = await prisma.file.delete({
    where: { id: fileId },
  });

  if (delFile.folderId) {
    res.redirect(`/folder/${delFile.folderId}`);
  } else {
    res.redirect("/explorer");
  }
}

async function deleteFolder(req, res) {
  const folderId = req.params.id;
  const delFolder = await prisma.folder.delete({
    where: { id: folderId },
  });

  if (delFolder.parentId) {
    res.redirect(`/folder/${delFolder.parentId}`);
  } else {
    res.redirect("/explorer");
  }
}

module.exports = {
  getSignUp,
  createSignUp,
  loginPost,
  getLogin,
  getLogOut,
  uploadFile,
  createFolder,
  getFolder,
  getfileExplorerRoot,
  downloadFile,
  deleteFile,
  deleteFolder,
};
