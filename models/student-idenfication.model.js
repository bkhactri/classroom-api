const { Sequelize } = require("sequelize");
const sequelize = require("../utils/database/connection");

const Classroom = require("./classroom.model");

const StudentIdentification = sequelize.define("student_identification", {
  id: {
    primaryKey: true,
    type: Sequelize.STRING,
    allowNull: false,
  },
  classroomId: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

StudentIdentification.belongsTo(Classroom);
Classroom.hasMany(StudentIdentification);

StudentIdentification.sync({ alter: true });

module.exports = StudentIdentification;
