const { Sequelize } = require("sequelize");
const sequelize = require("../utils/database/connection");

const Classroom = require("./classroom.model");
const StudentIdentification = require("./student-identification.model");
const GradeStructure = require("./grade-structure.model");
const User = require("./user.model");

const PrivateMessage = sequelize.define("private_message", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  classroomId: {
    primaryKey: true,
    type: Sequelize.UUID,
    allowNull: false,
  },
  gradeStructureId: {
    primaryKey: true,
    type: Sequelize.UUID,
    allowNull: false,
  },
  studentIdentificationId: {
    primaryKey: true,
    type: Sequelize.STRING,
    allowNull: false,
  },
  senderId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

PrivateMessage.belongsTo(Classroom);
PrivateMessage.belongsTo(GradeStructure);
PrivateMessage.belongsTo(StudentIdentification);
PrivateMessage.belongsTo(User, { as: "sender" });

Classroom.hasMany(PrivateMessage);
GradeStructure.hasMany(PrivateMessage);
StudentIdentification.hasMany(PrivateMessage);

// PrivateMessage.sync();

module.exports = PrivateMessage;
