require('custom-env').env()
// usage library
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
var cors = require("cors");

const dbPostgres = require("./core/database/config");
const dbSync = require("./core/database/sync");

// api routes
const classroomRoutes = require("./routes/classroom.routes");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.setHeader("Last-Modified", new Date().toUTCString());
  next();
});

app.use("/classroom", classroomRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

dbPostgres.authenticate().then(() => {
  console.log('databse-connect');
  dbSync.sync()
}).catch(console.log);

module.exports = app;
