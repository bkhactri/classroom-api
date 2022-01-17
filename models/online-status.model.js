const { Sequelize } = require("sequelize");
const sequelize = require("../utils/database/connection");

const User = require("./user.model");

const OnlineStatus = sequelize.define("online_status", {
  socketId: {
    primaryKey: true,
    type: Sequelize.STRING,
    allowNull: false,
  },
});

User.hasMany(OnlineStatus);
OnlineStatus.belongsTo(User);

// OnlineStatus.sync();

module.exports = OnlineStatus;
