const { Sequelize } = require("sequelize");
const sequelize = require("../utils/database/connection");
const bcrypt = require("bcryptjs");

const GoogleUser = sequelize.define("gooleUser", {
  userID: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  googleID: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  }
});

module.exports = GoogleUser;