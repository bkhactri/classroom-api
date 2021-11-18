const express = require("express");
const classroomController = require("../controllers/classroom.controller");
const authMiddleware = require("../middleware/authenticationCheck");

const router = express.Router();

router.get(
  "participants",
  authMiddleware.verifyToken,
  classroomController.getParticipantByClassID
);


module.exports = router;
