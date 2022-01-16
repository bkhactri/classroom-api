const express = require("express");
const authMiddleware = require("../middleware/authenticationCheck");
const studentIdenticationController = require("../controllers/student-identification.controller");

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
);

router.get(
  "/getByClass/:classroomId",
  authMiddleware.verifyToken,
  studentIdenticationController.getStudentsInClass
);

router.get(
  "/:studentId",
  authMiddleware.verifyToken,
  studentIdenticationController.getStudentById
)

module.exports = router;
