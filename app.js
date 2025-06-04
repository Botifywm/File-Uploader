const path = require("node:path");
const express = require("express");
const assetsPath = path.join(__dirname, "public");
const session = require("express-session");
const passport = require("passport");
const initializePassport = require("./config/passport");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(assetsPath));
app.use(express.static(path.join(__dirname, "DomFn")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: "a santa at nasa",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);

// Routes
const indexRouter = require("./routes/indexRouter");
app.use("/", indexRouter);

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`My first Upload app - listening on port ${PORT}!`)
);
