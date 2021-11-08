const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authenticationCheck");
const router = express.Router();

router.get("/", authMiddleware.verifyToken, authController.auth);

router.post("/login", authController.authLogin);

router.post("/signup", authController.authSignup);

router.post("/logout", authController.authLogout);

module.exports = router;
