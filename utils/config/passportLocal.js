const passport = require("passport");
const User = require("../../models/user.model");
const LocalStrategy = require("passport-local").Strategy;
const md5 = require("md5");

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findByPk(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  "classroom.login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      User.findOne({ where: { email: email } }).then((user, err) => {
        if (err) return done(err);

        if (!user)
          return done(null, false, {
            status: 400,
            message: "error.userNotFound",
          });

        if (!user.comparePassword(password))
          return done(null, false, {
            status: 400,
            message: "error.incorrectPassword",
          });
        return done(null, user);
      });
    }
  )
);

passport.use(
  "classroom.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      User.findOne({ where: { email: email } }).then((user, err) => {
        if (err) return done(err);

        if (user)
          return done(null, false, {
            status: 400,
            message: "error.takenEmail",
          });

        const userDataForSignUp = {
          username: req.body.username,
          email: email,
          password: password,
          avatarUrl: `https://gravatar.com/avatar/${md5(email)}?d=identicon`,
        };

        User.create(userDataForSignUp)
          .then(function (newUser, created) {
            if (!newUser) {
              return done(null, false);
            }

            if (newUser) {
              return done(null, newUser);
            }
          })
          .catch(function (err) {
            console.error(JSON.stringify(err, null, 2));
            return done(null, false, { status: 500 });
          });
      });
    }
  )
);
