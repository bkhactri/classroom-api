const { Sequelize } = require("sequelize");
const sequelize = require("../utils/database/connection");

const User = require("./user.model");

const Notification = sequelize.define("notification", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  link: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  viewStatus: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

User.hasMany(Notification);
Notification.belongsTo(User);

// Notification.sync({ alter: true });

module.exports = Notification;
