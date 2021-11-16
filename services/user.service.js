const User = require("../models/user.model");
const { Op } = require("sequelize");

const bcrypt = require("bcryptjs");

const getAccountInfo = async (userId) => {
  try {
    const queryResult = await User.findByPk(userId);
    return (resData = {
      id: queryResult.dataValues.id,
      displayName: queryResult.dataValues.displayName,
      studentId: queryResult.dataValues.studentId,
      username: queryResult.dataValues.username,
      email: queryResult.dataValues.email,
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

const updateAccountBasicInfo = async (data, userId) => {
  try {
    await User.update(data, {
      where: {
        id: userId,
      },
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

const getFieldExceptPk = async (key, value, userId) => {
  try {
    const queryResult = await User.findOne({
      where: { [key]: value, id: { [Op.ne]: userId } },
    });
    return queryResult;
  } catch (e) {
    throw new Error(e.message);
  }
};

const updateUserPassword = async (password, userId) => {
  try {
    const hashedPassword = bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(12),
      null
    );
    await User.update(
      { password: hashedPassword },
      {
        where: {
          id: userId,
        },
      }
    );
  } catch (e) {
    throw new Error(e.message);
  }
};

const comparePassword = (password, currentPassword) => {
  const result = bcrypt.compareSync(password, currentPassword);
  return result;
};

const mapStudentId = async (studentId, userId) => {
  try {
    await User.update(
      { studentId: studentId },
      {
        where: {
          id: userId,
        },
      }
    );
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  getAccountInfo,
  updateAccountBasicInfo,
  getFieldExceptPk,
  updateUserPassword,
  comparePassword,
  mapStudentId,
};
