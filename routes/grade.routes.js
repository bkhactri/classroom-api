const express = require("express");
const authMiddleware = require("../middleware/authenticationCheck");
const gradeController = require("../controllers/grade.controller");

const router = express.Router();

router.get(
  "/structure/:classroomId",
  authMiddleware.verifyToken,
  gradeController.getGradeStructures
);

router.get(
  "/template/:classroomId",
  authMiddleware.verifyToken,
  gradeController.getTemplate
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

router.post(
  "/upload",
  authMiddleware.verifyToken,
  gradeController.uploadFile
);

router.get(
  "/export/:classroomId/:gradeStructureId",
  authMiddleware.verifyToken,
  gradeController.exportGradeColumn
)

router.get(
  "/getGradeBoard/:classroomId",
  authMiddleware.verifyToken,
  gradeController.getGradeBoard
);

router.put(
  "/finalizedColumn",
  authMiddleware.verifyToken,
  gradeController.finalizedGradeColumn
);

module.exports = router;
