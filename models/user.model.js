const { Sequelize } = require("sequelize");
const sequelize = require("../utils/database/connection");
const bcrypt = require("bcryptjs");
const StudentIdentification = require("./student-idenfication.model");

const User = sequelize.define("user", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  displayName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  studentId: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  token: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  tokenExpires: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isBan: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "NORMAL",
  },
  // userRole: {
  //   type: Sequelize.ENUM,
  //   values: ["NORMAL", "ADMIN"],
  //   allowNull: false,
  //   defaultValue: "NORMAL"
  // },
});

User.beforeSave((user) => {
  if (user.changed("password")) {
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(12),
      null
    );
  }
});

User.prototype.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

User.sync({ alter: true });

module.exports = User;
