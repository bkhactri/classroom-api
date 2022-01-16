const GradeStructure = require("../models/grade-structure.model");

/**
 *
 * @param {*} data {name, point}
 * @param {*} classroomId
 */
const create = async (data, classroomId) => {
  try {
    const gradeStructures = await GradeStructure.findAll({
      where: { classroomId },
    });

    return await GradeStructure.create({
      ...data,
      order: gradeStructures.length,
      classroomId,
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

const findById = async (gradeStructureId) => {
  try {
    return await GradeStructure.findByPk(gradeStructureId);
  } catch (e) {
    throw new Error(e.message);
  }
}

const updateById = async (gradeStructureId, gradeStructure) => {
  try {
    return await GradeStructure.update(gradeStructure, {
      where: { id: gradeStructureId },
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

const getAll = async (classroomId) => {
  try {
    return await GradeStructure.findAll({
      where: { classroomId },
      order: [ ['order', 'ASC'] ]
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

const deleteById = async (gradeStructureId) => {
  try {
    return await GradeStructure.destroy({
      where: { id: gradeStructureId },
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  create,
  findById,
  updateById,
  getAll,
  deleteById,
};
