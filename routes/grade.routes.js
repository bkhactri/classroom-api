const express = require("express");
const authMiddleware = require("../middleware/authenticationCheck");
const gradeController = require("../controllers/grade.controller");

const router = express.Router();

router.get(
  "/structure/:classroomId",
  authMiddleware.verifyToken,
  gradeController.getGradeStructures
);

router.post(
  "/structure",
  authMiddleware.verifyToken,
  gradeController.createGradeStructure
);

router.put(
  "/structure",
  authMiddleware.verifyToken,
  gradeController.updateMultipleGradeStructures
);

router.put(
  "/structure/:gradeStructureId",
  authMiddleware.verifyToken,
  gradeController.updateGradeStructure
);

router.delete(
  "/structure/:gradeStructureId",
  authMiddleware.verifyToken,
  gradeController.deleteGradeStructure
);

router.post(
  "/gradeDraftSingleCell",
  authMiddleware.verifyToken,
  gradeController.gradeDraftSingleCell
);

router.get(
  "/getGradeBoard/:classroomId",
  authMiddleware.verifyToken,
  gradeController.getGradeBoard
);

module.exports = router;
