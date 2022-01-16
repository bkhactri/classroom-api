const passport = require("passport");
const {
  generateAccessToken,
  generateRefreshToken,
  generateCryptoToken,
} = require("../services/auth.service");

const {
  updateUserToken,
  findUserWithValidResetToken,
  updateUserPasswordAndClearToken,
  checkEmailExist,
  getAccountInfo,
} = require("../services/user.service");

const {
  sendRefreshPasswordEmail,
  sendVerifyMail,
} = require("../utils/config/nodemailer.config");

const refreshFetchUserInfo = async (req, res, next) => {
  try {
    const userInfo = await getAccountInfo(req.user.id);
    res.status(200).json(userInfo);
  } catch (error) {
    res.sendStatus(500) && next(error);
  }
};

const authLogin = async (req, res, next) => {
  passport.authenticate("classroom.login", function (err, user, info) {
    if (err) return res.status(500).send(err);

    if (info) {
      res.status(info.status).send(info.message);
    } else {
      const accessToken = generateAccessToken(user.dataValues);
      const refreshToken = generateRefreshToken(user.dataValues);
      const { id, username, email, isActive, avatarUrl } = user.dataValues;
      const responseData = {
        id,
        username,
        email,
        isActive,
        avatarUrl,
        accessToken,
        refreshToken,
      };
      res.status(200).send(responseData);
    }
  })(req, res, next);
};

const authSignup = async (req, res, next) => {
  passport.authenticate("classroom.signup", async function (err, user, info) {
    if (err) return res.status(500).send(err);

    if (info) {
      res.status(info.status).send(info.message);
    } else {
      const verifyToken = await generateCryptoToken();
      try {
        await updateUserToken(user.email, verifyToken);
        const verifyEmailLink = `${process.env.CLIENT_HOST}/verify-email/${verifyToken}`;
        const mailingRes = await sendVerifyMail(user.email, verifyEmailLink);

        if (mailingRes.accepted.length > 0) {
          res.status(200).json(mailingRes);
        }
      } catch (error) {
        res.sendStatus(500) && next(error);
      }
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
  req.user.then((user) => {
    const accessToken = generateAccessToken(user.dataValues);
    const refreshToken = generateRefreshToken(user.dataValues);
    const { id, username, email, isActive, avatarUrl } = user.dataValues;
    const responseData = {
      id,
      username,
      email,
      isActive,
      avatarUrl,
      accessToken,
      refreshToken,
    };
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
    const refreshPasswordToken = await generateCryptoToken();

    try {
      await updateUserToken(email, refreshPasswordToken);
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
  const { email, resetToken, password } = req.body;

  const user = await findUserWithValidResetToken(resetToken, email);

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

const verifyEmail = async (req, res, next) => {
  const { email, verifyToken } = req.body;

  findUserWithValidResetToken(verifyToken, email)
    .then((user) => {
      user.isActive = true;
      user.token = null;
      user.tokenExpires = null;
      return user.save();
    })
    .then((user) => {
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        const accessToken = generateAccessToken(req.user.dataValues);
        const refreshToken = generateRefreshToken(req.user.dataValues);
        const { id, username, email, isActive, avatarUrl } =
          req.user.dataValues;
        const responseData = {
          id,
          username,
          email,
          isActive,
          avatarUrl,
          accessToken,
          refreshToken,
        };
        res.status(200).send(responseData);
      });
    })
    .catch((error) => res.status(500).send(error));
};

const sendVerifyEmail = async (req, res, next) => {
  const { email } = req.body;
  const verifyToken = await generateCryptoToken();
  try {
    await updateUserToken(email, verifyToken);
    const verifyEmailLink = `${process.env.CLIENT_HOST}/verify-email/${verifyToken}`;
    const mailingRes = await sendVerifyMail(email, verifyEmailLink);

    if (mailingRes.accepted.length > 0) {
      res.status(200).json(mailingRes);
    }
  } catch (error) {
    res.sendStatus(500) && next(error);
  }
};

module.exports = {
  refreshFetchUserInfo,
  authLogin,
  authSignup,
  authLogout,
  googleAuthCall,
  googleAuthCallback,
  getUserAuthData,
  sendMailResetPassword,
  changePassword,
  verifyEmail,
  sendVerifyEmail,
};
