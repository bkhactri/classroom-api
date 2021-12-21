const { Sequelize } = require("sequelize");
const sequelize = require("../utils/database/connection");

const Classroom = require("./classroom.model");

const GradeStructure = sequelize.define("grade_structure", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  point: {
    type: Sequelize.DECIMAL(9, 2),
    allowNull: false,
  },
  order: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

GradeStructure.belongsTo(Classroom);
Classroom.hasMany(GradeStructure);

GradeStructure.sync({ alter: true });

module.exports = GradeStructure;
