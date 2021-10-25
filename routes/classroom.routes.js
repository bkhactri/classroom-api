const express = require("express");
const classroomController = require("../controllers/classroom.controller");

const router = express.Router();

router.get("/get-all", classroomController.getClasses);

router.get("/:classroomId", classroomController.getClass);

router.post("/create", classroomController.createNewClass);

module.exports = router;
