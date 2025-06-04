const { Router } = require("express");
const indexRouter = Router();
const uploadController = require("../controller/uploadController");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

indexRouter.get("/", uploadController.getLogin);
indexRouter.post("/login", uploadController.loginPost);

indexRouter.get("/signup", uploadController.getSignUp);
indexRouter.post("/createSignUp", uploadController.createSignUp);

indexRouter.get("/explorer", uploadController.getfileExplorerRoot);

indexRouter.post("/upload", upload.single("file"), uploadController.uploadFile);

indexRouter.post("/createFolder", uploadController.createFolder);
indexRouter.get("/folder/:id", uploadController.getFolder);

indexRouter.get("/logout", uploadController.getLogOut);

indexRouter.get("/download/:id", uploadController.downloadFile);

indexRouter.post("/deleteFile/:id", uploadController.deleteFile);
indexRouter.post("/deleteFolder/:id", uploadController.deleteFolder);

module.exports = indexRouter;
