require("custom-env").env();
require("./utils/config/passportLocal");
require("./utils/config/passportGoogle");
// usage library
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const io = require("socket.io");

const connection = require("./utils/database/connection");
const { checkMailConnection } = require("./utils/config/nodemailer.config");

// api routes
const classroomRoutes = require("./routes/classroom.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const mailRoutes = require("./routes/mail.routes");
const gradeRoutes = require("./routes/grade.routes");
const studentIdentificationRoutes = require("./routes/student-identification.routes");
const gradeRequestRoutes = require("./routes/grade-request.routes");

// constants
const { SESSION_CONFIG } = require("./utils/constants/index");

const app = express();

app.io = io;
app.use(session(SESSION_CONFIG));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.setHeader("Last-Modified", new Date().toUTCString());
  next();
});

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "files");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
app.use(
  multer({ storage: fileStorage }).fields([{ name: "file", maxCount: 1 }])
);

const filesDir = path.join(__dirname, "files");
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}
app.use("/files", express.static(filesDir));

app.use("/classroom", classroomRoutes);
app.use("/auth", authRoutes);
app.use("/account", userRoutes);
app.use("/mail", mailRoutes);
app.use("/grade", gradeRoutes);
app.use("/student-identification", studentIdentificationRoutes);
app.use("/grade-request", gradeRequestRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

connection
  .authenticate()
  .then(() => {
    console.log("DB Connected");
  })
  .catch(console.log);

checkMailConnection();

module.exports = app;
