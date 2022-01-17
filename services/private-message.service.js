const PrivateMessage = require("../models/private-message.model");
const User = require("../models/user.model");

const findByIds = async (
  classroomId,
  gradeStructureId,
  studentIdentificationId
) => {
  try {
    return await PrivateMessage.findAll({
      where: { classroomId, gradeStructureId, studentIdentificationId },
      order: [["createdAt", "ASC"]],
      include: {
        model: User,
        as: "sender",
        attributes: ["id", "username", "displayName"],
      },
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

const createRequestMessage = async (ids, data) => {
  const { classroomId, gradeStructureId, studentIdentificationId } = ids;
  const { message, senderId } = data;
  try {
    return await PrivateMessage.create(
      {
        classroomId,
        gradeStructureId,
        studentIdentificationId,
        message,
        senderId,
      },
      {
        include: {
          model: User,
          as: "sender",
          attributes: ["id", "username", "displayName"],
        },
      }
    );
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  findByIds,
  createRequestMessage,
};
