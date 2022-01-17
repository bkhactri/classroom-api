const express = require("express");
const authMiddleware = require("../middleware/authenticationCheck");
const gradeRequestController = require("../controllers/grade-request.controller");

const router = express.Router();

router.get(
  "/:classroomId",
  authMiddleware.verifyToken,
  gradeRequestController.getAllRequests
)

router.get(
  "/:classroomId/:gradeStructureId/:studentIdentificationId",
  authMiddleware.verifyToken,
  gradeRequestController.getSpecificStudentRequests
)

router.post(
  "/:classroomId/:gradeStructureId/:studentIdentificationId",
  authMiddleware.verifyToken,
  gradeRequestController.createRequest
)

router.get(
  "/message/:classroomId/:gradeStructureId/:studentIdentificationId",
  authMiddleware.verifyToken,
  gradeRequestController.getRequestMessages
)

router.post(
  "/message/:classroomId/:gradeStructureId/:studentIdentificationId",
  authMiddleware.verifyToken,
  gradeRequestController.createRequestMessage
)

router.put(
  "/:classroomId/:gradeStructureId/:studentIdentificationId/:gradeRequestId",
  authMiddleware.verifyToken,
  gradeRequestController.updateRequest
)

module.exports = router;