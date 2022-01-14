const userService = require("../services/user.service");

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

const checkAdminAuthen = (req, res) => {
  if (req.user.role !== "ADMIN"){
    res.status(404);
  }
} 

const getAllUsers = async (req, res, next) => {
  try {
    checkAdminAuthen(req, res);

    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const getAllAdmins = async (req, res, next) => {
  try {
    checkAdminAuthen(req, res);

    const users = await userService.getAllAdmins();
    res.status(200).json(users);
  } catch (err) {
    res.sendStatus(500) && next(err);
  }
};

const updateBanStatus = async (req, res, next) => {

  const id = req.body.userID;
  const isBan = req.body.newBanStatus;
  checkAdminAuthen(req, res);


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
  checkAdminAuthen(req, res);

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

    if (req.user.role !== "ADMIN"){
      res.status(404);
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


module.exports = {
  getUserAccountInfo,
  updateUserBasicInfo,
  updateUserPassword,
  mapStudentId,
  getAllUsers,
  getAllAdmins,
  updateBanStatus,
  getUserInfo,
  updateAdminStatus,
  getUserRole,
};
