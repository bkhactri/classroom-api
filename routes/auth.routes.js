const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authenticationCheck");
const router = express.Router();

router.get("/", authMiddleware.verifyToken, authController.auth);

router.post("/login", authController.authLogin);

router.post("/signup", authController.authSignup);

router.post("/logout", authController.authLogout);

router.get("/google/callback", authController.googleAuthCallback);

router.get("/google", authController.googleAuthCall);

router.get("/getUserAuthData", authController.getUserAuthData);

router.post("/resetPassword", authController.sendMailResetPassword);

router.post("/changePassword", authController.changePassword);

module.exports = router;
