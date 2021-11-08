const jwt = require("jsonwebtoken");

const generateAccessToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET_KEY_TOKEN);
};

const generateRefreshToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET_KEY_REFRESH_TOKEN);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
