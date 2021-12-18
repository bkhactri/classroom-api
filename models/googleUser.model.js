const { Sequelize } = require("sequelize");
const sequelize = require("../utils/database/connection");

const GoogleUser = sequelize.define("gooleUser", {
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

GoogleUser.sync({ alter: true });

module.exports = GoogleUser;
