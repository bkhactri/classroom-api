//const userModel = require('../../../models/user.model');
const passport = require("passport");


const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const GOOGLE_CLIENT_ID = '202449967032-kvdat9mvib22cqbqlc3c3ehfu6f5kb2i.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

const initializeGooglePassport = (passport) => {
    passport.use(new GoogleStrategy(
        {
            clientID:     GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8000/auth/google/callback",
            passReqToCallback: true
        },

        (accessToken, refreshToken, profile, done) => {
            // userModel.getUserGoogleByGoogleID(profile.id).then((rows) => {
            //     if (rows.length === 0){
            //         const user = rows[0];
            //         done(null, user);
            //     } else {
            //         console.log(profile);
            //         done(null, {id: profile.id});
            //     }
            // });
            console.log('profile: ', profile);
            done(null, {profile: profile});
        }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        // userModel.getUserGoogleByGoogleID(id).then((rows) => {
        //     done(null, rows[0]);
        // });
        done(null, {id: 1});
    });
}

initializeGooglePassport(passport);