const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateAccessToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET_KEY_TOKEN);
};

const generateRefreshToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET_KEY_REFRESH_TOKEN);
};

const generateCryptoToken = async () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) reject(err);
      const token = buffer.toString("hex");
      resolve(token);
    });
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateCryptoToken,
};
