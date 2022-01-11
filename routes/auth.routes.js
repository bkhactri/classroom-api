const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authenticationCheck");
const router = express.Router();

router.get(
  "/refresh/getUserInfo",
  authMiddleware.verifyToken,
  authController.refreshFetchUserInfo
);

router.post("/login", authController.authLogin);

router.post("/signup", authController.authSignup);

router.post("/logout", authController.authLogout);

router.get("/google/callback", authController.googleAuthCallback);

router.get("/google", authController.googleAuthCall);

router.get("/getUserAuthData", authController.getUserAuthData);

router.post("/resetPassword", authController.sendMailResetPassword);

router.post("/changePassword", authController.changePassword);

router.post("/sendVerifyEmail", authController.sendVerifyEmail);

router.post("/verifyEmail", authController.verifyEmail);

module.exports = router;
