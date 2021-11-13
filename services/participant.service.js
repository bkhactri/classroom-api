const Participant = require("../models/participant.model");

/**
 * 
 * @param {*} userId 
 * @param {*} classroomId 
 * @param {*} role [OWNER, TEACHER, STUDENT]
 * @returns 
 */
const create = async (userId, classroomId, role) => {
  try {
    return await Participant.create({
      userId, classroomId, role
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = { create };
