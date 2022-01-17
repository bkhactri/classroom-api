const OnlineStatus = require("../models/online-status.model");

const getUserOnlineById = async (userIds) => {
  try {
    return await OnlineStatus.findAll({ where: { userId: userIds } });
  } catch (e) {
    throw new Error(e.message);
  }
};

const addNewUser = async (userId, socketId) => {
  try {
    return await OnlineStatus.create({ socketId, userId });
  } catch (e) {
    throw new Error(e.message);
  }
};

const removeUser = async (socketId) => {
  try {
    return await OnlineStatus.destroy({
      where: { socketId },
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  getUserOnlineById,
  addNewUser,
  removeUser,
};
