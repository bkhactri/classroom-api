const { Sequelize } = require("sequelize");
const sequelize = require("../utils/database/connection");

const Classroom = require("./classroom.model");
const StudentIdentification = require("./student-identification.model");
const GradeStructure = require("./grade-structure.model");

const Grade = sequelize.define("grade", {
  point: {
    type: Sequelize.DECIMAL(9, 2),
    allowNull: true,
  },
  status: {
    type: Sequelize.ENUM,
    values: ["DRAFT", "FINALIZED"],
    allowNull: true,
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
});

Grade.belongsTo(Classroom);
Grade.belongsTo(GradeStructure);
Grade.belongsTo(StudentIdentification);

Classroom.hasMany(Grade);
GradeStructure.hasMany(Grade);
StudentIdentification.hasMany(Grade);

// Use below code if you edit Schema
// Grade.sync({alter: true});

module.exports = Grade;
