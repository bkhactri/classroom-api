const express = require("express");
const classroomController = require("../controllers/classroom.controller");
const authMiddleware = require("../middleware/authenticationCheck");

const router = express.Router();

router.get(
  "/allClassrooms",
  authMiddleware.verifyAdmin,
  classroomController.getAllClasses
);

router.get(
  "/getClassroom/:classroomID",
  authMiddleware.verifyAdmin,
  classroomController.getClassroomByID
);

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
  "/participants",
  authMiddleware.verifyToken,
  classroomController.getParticipantByClassID
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
);

router.put(
  "/:classroomId",
  authMiddleware.verifyToken,
  classroomController.saveClass
);

module.exports = router;
