const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/authenticationCheck");

const router = express.Router();

router.get(
  "/info/:userId",
  authMiddleware.verifyToken,
  userController.getUserDetail
);

router.get("/", authMiddleware.verifyToken, userController.getUserAccountInfo);

router.put(
  "/basic-info",
  authMiddleware.verifyToken,
  userController.updateUserBasicInfo
);

router.put(
  "/change-password",
  authMiddleware.verifyToken,
  userController.updateUserPassword
);

router.post(
  "/map-studentId",
  authMiddleware.verifyToken,
  userController.mapStudentId
);

module.exports = router;
