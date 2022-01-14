const userService = require("../services/user.service");
const participantService = require("../services/participant.service");

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
        return res.status(403).send("Email is taken");
      }
    } else if (username) {
      console.log("Username");
      const usernameExist = await userService.getFieldExceptPk(
        "username",
        username,
        req.user.id
      );
      console.log(usernameExist);
      if (usernameExist) {
        return res.status(403).send("Username is taken");
      }
    }
    const updateData = {
      email: email ? email : req.user.email,
      displayName: displayName ? displayName : req.user.displayName,
      username: username ? username : req.user.username,
    };

    console.log(updateData);

    await userService.updateAccountBasicInfo(updateData, req.user.id);
    res.status(200).send("Completed update user data");
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const updateUserPassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!userService.comparePassword(oldPassword, req.user.password)) {
    return res.status(403).send("Old password is not correct");
  } else {
    await userService.updateUserPassword(newPassword, req.user.id);
    res.status(200).send("Update user password");
  }
};

const mapStudentId = async (req, res, next) => {
  const { studentId } = req.body;

  try {
    await userService.mapStudentId(studentId, req.user.id);
    res.status(200).send("Completed map student id");
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

module.exports = {
  getUserAccountInfo,
  updateUserBasicInfo,
  updateUserPassword,
  mapStudentId,
  getUserDetail,
};
