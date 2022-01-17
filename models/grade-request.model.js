const { Sequelize } = require("sequelize");
const sequelize = require("../utils/database/connection");

const Classroom = require("./classroom.model");
const StudentIdentification = require("./student-identification.model");
const GradeStructure = require("./grade-structure.model");
const User = require("./user.model");

const GradeRequest = sequelize.define("grade-request", {
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
  resolveStatus: {
    type: Sequelize.ENUM,
    values: ["ACCEPTED", "DENIED"],
    allowNull: true,
  },
  point: {
    type: Sequelize.DECIMAL(9, 2),
    allowNull: false,
  },
  reason: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  resolverId: {
    type: Sequelize.UUID,
    allowNull: true,
  }
});

GradeRequest.belongsTo(Classroom);
GradeRequest.belongsTo(GradeStructure);
GradeRequest.belongsTo(StudentIdentification);
GradeRequest.belongsTo(User, { as: "resolver" });

Classroom.hasMany(GradeRequest);
GradeStructure.hasMany(GradeRequest);
StudentIdentification.hasMany(GradeRequest);

// GradeRequest.sync();

module.exports = GradeRequest;
