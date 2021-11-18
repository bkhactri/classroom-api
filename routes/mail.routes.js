const express = require("express");
const mailController = require("../controllers/mail.controller");
const authMiddleware = require("../middleware/authenticationCheck");
const router = express.Router();

router.post("/student", authMiddleware.verifyToken, mailController.sendInviteToStudents);

router.post("/teacher", authMiddleware.verifyToken, mailController.sendInviteToTeachers);

module.exports = router;
