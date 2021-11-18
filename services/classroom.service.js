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

const findMyClassById = async (classroomId, userId) => {
  try {
    return await Classroom.findOne({
      where: { id: classroomId },
      include: {
        model: Participant,
        required: true,
        where: {
          userId,
        },
        attributes: ["role"]
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
        attributes: []
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

  const temp = classCode.split("").reverse();
  const teacherCode = temp
    .slice(parseInt(classCode.length / 2))
    .concat(temp.slice(0, parseInt(classCode.length / 2)))
    .map((char) => {
      if (char === 'Z') {
        return String.fromCharCode(char.charCodeAt() - 1);
      }
      return String.fromCharCode(char.charCodeAt() + 1);
    })
    .join("");

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
