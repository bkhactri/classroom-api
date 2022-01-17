const { Sequelize } = require("sequelize");
const sequelize = require("../utils/database/connection");

const GoogleUser = sequelize.define("google_user", {
  userID: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  googleID: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  },
});

// Use below code if you edit Schema
// GoogleUser.sync({alter: true});

module.exports = GoogleUser;
