//const userModel = require('../../../models/user.model');
const passport = require("passport");
const GoogleUser = require("../../models/googleUser.model");
const User = require("../../models/user.model");

const GoogleStrategy = require("passport-google-oauth2").Strategy;

const GOOGLE_CLIENT_ID =
  "242348377463-m3grl1leu4gu8rqelo7hmnc6igpckvn0.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const initializeGooglePassport = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
      },

      function (request, accessToken, refreshToken, profile, done) {
        GoogleUser.findByPk(profile.id).then((googleUser, err) => {
          if (err) return done(err);

          if (googleUser === null) {
            const username = `Google@${profile.id}`;
            const email = profile.email;
            const password = profile.id;

            register(username, email, password, profile.id, GoogleUser, done);
          } else {
            User.findByPk(googleUser.userID).then((user) => {
              return done(null, user);
            });
          }
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findByPk(id, function (err, user) {
      done(err, user);
    });
  });
};

const register = (
  username,
  email,
  password,
  googleID,
  GoogleUserTable,
  done
) => {
  User.findOne({ where: { email: email } }).then((user, err) => {
    if (err) return done(err);

    if (user)
      return done(null, false, { status: 400, message: "Email is taken" });

    const userDataForSignUp = {
      username: username,
      email: email,
      password: password,
    };

    User.create(userDataForSignUp)
      .then(function (newUser, created) {
        if (!newUser) {
          return done(null, false);
        }

        if (newUser) {
          GoogleUserTable.create({ userID: newUser.id, googleID: googleID });
          return done(null, newUser);
        }
      })
      .catch(function (err) {
        console.error(JSON.stringify(err, null, 2));
        return done(null, false, { status: 500 });
      });
  });
};

initializeGooglePassport(passport);
