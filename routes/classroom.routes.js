const express = require("express");
const classroomController = require("../controllers/classroom.controller");
const authMiddleware = require("../middleware/authenticationCheck");

const router = express.Router();

router.get(
  "/get-all",
  authMiddleware.verifyToken,
  classroomController.getClasses
);

router.get(
  "/join",
  authMiddleware.verifyToken,
  classroomController.getClassInviteInfo
);

router.get(
  "/:classroomId",
  authMiddleware.verifyToken,
  classroomController.getClass
);

router.post(
  "/create",
  authMiddleware.verifyToken,
  classroomController.createNewClass
);

router.post(
  "/join",
  authMiddleware.verifyToken,
  classroomController.joinClass
)

module.exports = router;
