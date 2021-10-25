// database
const sequelize = require("./config");
const Classroom = require("../../models/classroom.model");

exports.sync = async () => {
  try {
    await sequelize.sync();
  } catch (err) {
    console.log(err);
  }
};
