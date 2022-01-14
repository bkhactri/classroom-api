const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/authenticationCheck");

const router = express.Router();

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

router.get(
  "/getAllUsers", 
  authMiddleware.verifyToken, 
  userController.getAllUsers
  );

router.get(
  "/getAllAdmins", 
  authMiddleware.verifyToken, 
  userController.getAllAdmins
  );

router.put(
  "/updateBanStatus",
  authMiddleware.verifyToken,
  userController.updateBanStatus
);

router.get(
  "/userInfo/:userID",
  authMiddleware.verifyToken,
  userController.getUserInfo
);

router.put(
  "/updateAdminStatus",
  authMiddleware.verifyToken,
  userController.updateAdminStatus
);

router.get(
  "/userRole",
  authMiddleware.verifyToken,
  userController.getUserRole
);

module.exports = router;
