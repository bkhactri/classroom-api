const Participant = require("../models/participant.model");
const User = require("../models/user.model");

/**
 *
 * @param {*} userId
 * @param {*} classroomId
 * @param {*} role ["OWNER", "TEACHER", "STUDENT"]
 * @returns
 */
const create = async (userId, classroomId, role) => {
  try {
    return await Participant.create({
      userId,
      classroomId,
      role,
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

const findById = async (userId, classroomId) => {
  try {
    return await Participant.findOne({
      where: { userId, classroomId },
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

const findByClassID = async (classroomId) => {
  try {
    return await Participant.findAll({
      where: { classroomId : classroomId},
      include: [{
        model: User,
        required: true
       }]
    });
  } catch (e) {
    throw new Error(e.message);
  }
};
module.exports = { create, findById, findByClassID };
