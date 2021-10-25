const Classroom = require("../models/classroom.model");

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
};

module.exports = { create, findAll, findById };
