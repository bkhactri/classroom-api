const express = require("express");
const authMiddleware = require("../middleware/authenticationCheck");
const studentIdenticationController = require("../controllers/student-idenfication.controller");

const router = express.Router();

router.get(
  "/template",
  authMiddleware.verifyToken,
  studentIdenticationController.getTemplate
);

router.post(
  "/upload",
  authMiddleware.verifyToken,
  studentIdenticationController.uploadFile
)

module.exports = router;