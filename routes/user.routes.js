const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/authenticationCheck");

const router = express.Router();

router.get(
  "/:classroomId/info/:userId",
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

router.get(
  "/getAllUsers",
  authMiddleware.verifyAdmin,
  userController.getAllUsers
);

router.get(
  "/getAllAdmins",
  authMiddleware.verifyAdmin,
  userController.getAllAdmins
);

router.put(
  "/updateBanStatus",
  authMiddleware.verifyAdmin,
  userController.updateBanStatus
);

router.get(
  "/userInfo/:userID",
  authMiddleware.verifyAdmin,
  userController.getUserInfo
);

router.put(
  "/updateAdminStatus",
  authMiddleware.verifyAdmin,
  userController.updateAdminStatus
);

router.get("/userRole", authMiddleware.verifyToken, userController.getUserRole);

router.get(
  "/notifications/:userId",
  authMiddleware.verifyToken,
  userController.getNotifications
);

router.put(
  "/notifications",
  authMiddleware.verifyToken,
  userController.updateNotificationsStatus
);

module.exports = router;
