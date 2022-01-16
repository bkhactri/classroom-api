const GradeRequest = require("../models/grade-request.model");

const findManyByIds = async (
  classroomId,
  gradeStructureId,
  studentIdentificationId
) => {
  try {
    return await GradeRequest.findAll({
      where: { classroomId, gradeStructureId, studentIdentificationId },
      order: [["createdAt", "DESC"]],
      include: 'resolver'
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

const findLatestOneByIds = async (
  classroomId,
  gradeStructureId,
  studentIdentificationId
) => {
  try {
    return await GradeRequest.findOne({
      where: { classroomId, gradeStructureId, studentIdentificationId, resolveStatus: null },
      order: [["createdAt", "DESC"]],
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * 
 * @param  ids { classroomId, gradeStructureId, studentIdentificationId }
 * @param data { point, reason }
 */
const create = async (ids, data) => {
  const { classroomId, gradeStructureId, studentIdentificationId } = ids;
  const { point, reason } = data;
  try {
    return await GradeRequest.create({
      classroomId,
      gradeStructureId,
      studentIdentificationId,
      point,
      reason,
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * 
 * @param  ids { gradeRequestId, classroomId, gradeStructureId, studentIdentificationId }
 * @param data { resolveStatus, resolverId }
 */
const update = async (ids, data) => {
  const {
    gradeRequestId,
    classroomId,
    gradeStructureId,
    studentIdentificationId,
  } = ids;
  const { resolveStatus, resolverId } = data;
  try {
    return await GradeRequest.update(
      { resolveStatus, resolverId },
      {
        where: {
          id: gradeRequestId,
          classroomId,
          gradeStructureId,
          studentIdentificationId,
        },
        returning: true,
      }
    );
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  findManyByIds,
  findLatestOneByIds,
  create,
  update
}
