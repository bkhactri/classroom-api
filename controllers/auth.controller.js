const passport = require("passport");
const {
  generateAccessToken,
  generateRefreshToken,
  generateRefreshPasswordToken,
} = require("../services/auth.service");

const {
  updateRefreshPasswordToken,
  findUserWithValidResetToken,
  updateUserPasswordAndClearToken,
  checkEmailExist,
} = require("../services/user.service");

const {
  sendRefreshPasswordEmail,
} = require("../utils/config/nodemailer.config");

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
  res.sendStatus(200);
};

const googleAuthCall = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
};

const googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) return res.status(500).send(err);

    if (
      !(
        info &&
        Object.keys(info).length === 0 &&
        Object.getPrototypeOf(info) === Object.prototype
      )
    ) {
      res.status(info.status).send(info.message);
    } else {
      const accessToken = generateAccessToken(user.dataValues);
      const refreshToken = generateRefreshToken(user.dataValues);
      const { id, username, email } = user.dataValues;
      const responseData = { id, username, email, accessToken, refreshToken };

      let url = new URL(`${process.env.REACT_CLIENT_END_POINT}/loginSucess`);
      url.searchParams.append("id", id);
      url.searchParams.append("accessToken", accessToken);
      res.redirect(url);
    }
  })(req, res, next);
};

const getUserAuthData = async (req, res, next) => {
  // console.log('req.user', req.user);
  req.user.then((user) => {
    const accessToken = generateAccessToken(user.dataValues);
    const refreshToken = generateRefreshToken(user.dataValues);
    const { id, username, email } = user.dataValues;
    const responseData = { id, username, email, accessToken, refreshToken };
    res.status(200).send(responseData);
  });
};

const sendMailResetPassword = async (req, res, next) => {
  let isEmailExist;
  const { email } = req.body;

  try {
    isEmailExist = await checkEmailExist(email);
  } catch (error) {
    res.status(500).send("Email not found");
  }

  if (isEmailExist) {
    const refreshPasswordToken = await generateRefreshPasswordToken();

    try {
      await updateRefreshPasswordToken(email, refreshPasswordToken);
      const resetPasswordLink = `${process.env.CLIENT_HOST}/change-password/${refreshPasswordToken}`;

      const mailingRes = await sendRefreshPasswordEmail(
        email,
        resetPasswordLink
      );

      if (mailingRes.accepted.length > 0) {
        res.status(200).json(mailingRes);
      }
    } catch (error) {
      res.sendStatus(500) && next(error);
    }
  }
};

const changePassword = async (req, res, next) => {
  const { resetToken, password } = req.body;

  const user = await findUserWithValidResetToken(resetToken);

  if (user) {
    try {
      const result = await updateUserPasswordAndClearToken(user.id, password);

      res.status(200).json(result);
    } catch (error) {
      res.sendStatus(500) && next(error);
    }
  } else {
    res.status(500).send("Error occur!! Can not update password");
  }
};

module.exports = {
  auth,
  authLogin,
  authSignup,
  authLogout,
  googleAuthCall,
  googleAuthCallback,
  getUserAuthData,
  sendMailResetPassword,
  changePassword,
};
