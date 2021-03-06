const userService = require("../services/user.service");
const participantService = require("../services/participant.service");
const notificationService = require("../services/notification.service");

const getUserAccountInfo = async (req, res, next) => {
  try {
    const userInfo = await userService.getAccountInfo(req.user.id);
    res.status(200).json(userInfo);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const updateUserBasicInfo = async (req, res, next) => {
  try {
    const { email, displayName, username } = req.body.newUserData;
    if (email) {
      console.log("Email");
      const emailExist = await userService.getFieldExceptPk(
        "email",
        email,
        req.user.id
      );
      if (emailExist) {
        return res.status(403).send("error.takenEmail");
      } else {
        await userService.updateActiveStatus(req.user.id);
      }
    } else if (username) {
      console.log("Username");
      const usernameExist = await userService.getFieldExceptPk(
        "username",
        username,
        req.user.id
      );
      if (usernameExist) {
        return res.status(403).send("error.takenUsername");
      }
    }
    const updateData = {
      email: email ? email : req.user.email,
      displayName: displayName ? displayName : req.user.displayName,
      username: username ? username : req.user.username,
    };

    await userService.updateAccountBasicInfo(updateData, req.user.id);
    res.status(200).send("notice.completedUpdateInfo");
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const updateUserPassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!userService.comparePassword(oldPassword, req.user.password)) {
    return res.status(403).send("error.oldPasswordIncorrect");
  } else {
    await userService.updateUserPassword(newPassword, req.user.id);
    res.status(200).send("notice.updatedUserPassword");
  }
};

const mapStudentId = async (req, res, next) => {
  const { studentId } = req.body;

  try {
    await userService.mapStudentId(studentId, req.user.id);
    res.status(200).send("notice.completedMapId");
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getUserDetail = async (req, res, next) => {
  const { classroomId, userId } = req.params;
  try {
    const userInfo = await userService.getAccountInfo(userId);
    const participantInfo = await participantService.findById(
      userId,
      classroomId
    );

    const responseData = { ...userInfo, role: participantInfo.dataValues.role };
    res.status(200).send(responseData);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getAllAdmins = async (req, res, next) => {
  try {
    const users = await userService.getAllAdmins();
    res.status(200).json(users);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const updateBanStatus = async (req, res, next) => {
  const id = req.body.userID;
  const isBan = req.body.newBanStatus;

  try {
    await userService.updateBanStatus(id, isBan);

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const updateAdminStatus = async (req, res, next) => {
  const id = req.body.userID;
  const role = req.body.newAdminStatus;

  try {
    await userService.updateAdminiStatus(id, role);

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const id = req.params.userID;

    if (req.user.role !== "ADMIN") {
      return res.status(404);
    }

    const userInfo = await userService.getUserInfo(id);
    res.status(200).json(userInfo);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getUserRole = async (req, res, next) => {
  try {
    const role = await userService.getUserRole(req.user.id);
    res.status(200).json(role);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getNotifications = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const notifications = await notificationService.getNotificationsByUserId(
      userId
    );
    res.status(200).json(notifications);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const updateNotificationsStatus = async (req, res, next) => {
  const { userId, noticeId } = req.body;

  console.log(userId, noticeId);

  try {
    const result = await notificationService.updateNotificationsStatus(
      userId,
      noticeId
    );
    res.status(200).json(result[1]);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

module.exports = {
  getUserAccountInfo,
  updateUserBasicInfo,
  updateUserPassword,
  mapStudentId,
  getUserDetail,
  getAllUsers,
  getAllAdmins,
  updateBanStatus,
  getUserInfo,
  updateAdminStatus,
  getUserRole,
  getNotifications,
  updateNotificationsStatus,
};
