const { Sequelize } = require("sequelize");
const sequelize = require("../utils/database/connection");
const bcrypt = require("bcryptjs");

const User = sequelize.define("user", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
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

module.exports = User;
