const { Sequelize } = require("sequelize");
const sequelize = require("../utils/database/connection");

const Classroom = require("./classroom.model");
const StudentIdenfication = require("./student-idenfication.model");
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
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  gradeStructureId: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
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
Grade.belongsTo(StudentIdenfication);

Classroom.hasMany(Grade);
StudentIdenfication.hasMany(Grade);

Grade.sync();

module.exports = Grade;
