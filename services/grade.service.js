const Grade = require("../models/grade.model");

const gradeByStudentId = async (data) => {
  try {
    return await Grade.upsert({
      point: data.gradePoint,
      status: data.status,
      classroomId: data.classroomId,
      gradeStructureId: data.gradeId,
      studentIdentificationId: data.studentId,
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

const getBoardByClassId = async (classroomId) => {
  try {
    return await Grade.findAll({
      where: {
        classroomId: classroomId,
      },
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  gradeByStudentId,
  getBoardByClassId,
};
