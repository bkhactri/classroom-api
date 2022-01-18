const Notification = require("../models/notification.model");

const createNotification = async (userId, message, link) => {
  try {
    return await Notification.create(
      { userId, message, link },
      { returning: true, raw: true }
    );
  } catch (e) {
    throw new Error(e.message);
  }
};

const getNotificationsByUserId = async (userId) => {
  try {
    return await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      raw: true,
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

const updateNotificationsStatus = async (userId, noticeId) => {
  try {
    return await Notification.update(
      { viewStatus: true },
      { where: { userId: userId, id: noticeId }, returning: true, raw: true }
    );
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  createNotification,
  getNotificationsByUserId,
  updateNotificationsStatus,
};
