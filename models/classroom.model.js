const { Sequelize } = require("sequelize");
const sequelize = require("../core/database/config");

const Classroom = sequelize.define("classroom", {
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
  section: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  subject: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  room: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  author: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Classroom;
