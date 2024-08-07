const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust the path to your User model

const passportConfig = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
    }, async (email, password, done) => {
        try {
            // Find the user by email
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'No user found with this email' });
            }

            // Compare provided password with the hashed password stored in the database
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password' });
            }

            // Successful authentication
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

module.exports = passportConfig;
