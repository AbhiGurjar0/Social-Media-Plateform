const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user-model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            let user = await User.findOne({ email });

            if (user) {
                
                user.email = email;
                return done(null, user);
            }

            // ❌ New Google user → create account
            const fullName = profile.displayName;
            const randomSuffix = Math.floor(1000 + Math.random() * 9000);
            let baseUserName = fullName.split(" ")[0].toLowerCase();
            baseUserName = baseUserName.slice(0, 6); // limit base to 6 chars
            const userName = (baseUserName + "_" + randomSuffix).slice(0, 10);
            const salt = await bcrypt.genSalt(10);
            const dummyPassword = crypto.randomBytes(10).toString('hex');
            const hashedPassword = await bcrypt.hash(dummyPassword, salt);

            const newUser = await User.create({
                userName,
                fullName,
                email,
                password: hashedPassword,
                profilePic: undefined,
                bio: '',
                role: 'user'
            });
            return done(null, newUser);

        } catch (err) {
            console.error("Google Auth Error:", err);
            return done(err, null);
        }
    }
));

// Required for login session handling
passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
