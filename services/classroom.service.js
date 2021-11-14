const Classroom = require("../models/classroom.model");
const Participant = require("../models/participant.model");

const create = async (data) => {
  try {
    return await Classroom.create(data);
  } catch (e) {
    throw new Error(e.message);
  }
};

const findAll = async () => {
  try {
    return await Classroom.findAll();
  } catch (e) {
    throw new Error(e.message);
  }
};

const findById = async (classroomId) => {
  try {
    return await Classroom.findByPk(classroomId);
  } catch (e) {
    throw new Error(e.message);
  }
}

const findMyClassById = async (classroomId) => {
  try {
    return await Classroom.findOne({
      where: { id: classroomId },
      include: {
        model: Participant,
      },
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

const findMyClasses = async (userId) => {
  try {
    return await Classroom.findAll({
      include: {
        model: Participant,
        required: true,
        where: {
          userId,
        },
      },
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

const findByClassCode = async (classCode) => {
  try {
    return await Classroom.findOne({
      where: { classCode }
    });
  } catch (e) {
    throw new Error(e.message);
  }
}

/**
 * Generate class code from classroom id and update that class
 *
 * @param {*} classroom
 */
const generateClassCodeAndSave = async (classroom) => {
  const hexString = classroom.id.replace(/-/g, "");

  const classCode = Buffer.from(hexString, "hex").toString("base64").replace(/=/g, "");

  return await classroom.update({ classCode });
};

/**
 * Compare the two code to determine whether the invite link is for teacher or student
 * 
 * @param {*} requestedCode 
 * @param {*} classCode 
 * @returns role ["TEACHER", "STUDENT", null]
 */
const getClassRole = (requestedCode, classCode) => {
  if (requestedCode === classCode) return "STUDENT";

  const hexString = classCode.split("").reverse().join("").toLowerCase();
  const teacherCode = Buffer.from(hexString, "hex").toString("base64").replace(/=/g, "");

  if (requestedCode === teacherCode) return "TEACHER";
  
  return null;
}

module.exports = {
  create,
  findAll,
  findById,
  findMyClassById,
  findByClassCode,
  findMyClasses,
  generateClassCodeAndSave,
  getClassRole,
};
