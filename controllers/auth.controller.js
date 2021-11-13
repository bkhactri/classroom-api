const passport = require("passport");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../services/auth.service");

const auth = async (req, res, next) => {
  res.status(200).json(req.user.id);
};

const authLogin = async (req, res, next) => {
  passport.authenticate("classroom.login", function (err, user, info) {
    if (err) return res.status(500).send(err);

    if (info) {
      res.status(info.status).send(info.message);
    } else {
      const accessToken = generateAccessToken(user.dataValues);
      const refreshToken = generateRefreshToken(user.dataValues);
      const { id, username, email } = user.dataValues;
      const responseData = { id, username, email, accessToken, refreshToken };
      res.status(200).send(responseData);
    }
  })(req, res, next);
};

const authSignup = async (req, res, next) => {
  passport.authenticate("classroom.signup", function (err, user, info) {
    if (err) return res.status(500).send(err);

    if (info) {
      res.status(info.status).send(info.message);
    } else {
      res.status(200).send(user.dataValues);
    }
  })(req, res, next);
};

const authLogout = async (req, res, next) => {
  req.logout();
};

module.exports = {
  auth,
  authLogin,
  authSignup,
  authLogout,
};
