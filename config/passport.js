// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../models/user');

//function for creating UUID's
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with phoneNumber
        usernameField : 'phoneNumber',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, phoneNumber, password, done) {
        console.log("are we even getting here???");
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
            console.log("IN THE PASSPORT FUNCTION ");
             // find a user whose phoneNumber is the same as the forms phoneNumber
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.phoneNumber' :  phoneNumber.toLowerCase() }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that phoneNumber
                if (user) {
                    return done(null, false, req.flash('registerMessage', 'That phoneNumber is already taken.'));
                } else {

                    // if there is no user with that phoneNumber
                    // create the user
                    var newUser            = new User();

                    var delim = "-";
                    var newUuid = (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());

                    // set the user's local credentials
                    newUser.local.phoneNumber    = phoneNumber.toLowerCase();
                    newUser.local.password       = newUser.generateHash(password);
                    newUser.local.uuid           = newUuid;
                    newUser.local.account_level  = 'researcher';
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }

            });
        });
    }));

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with phoneNumber
        usernameField : 'phoneNumber',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, phoneNumber, password, done) { // callback with phoneNumber and password from our form

        // find a user whose phoneNumber is the same as the forms phoneNumber
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.phoneNumber' :  phoneNumber }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessageError', 'User not found')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessageError', 'Invalid password')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            else return done(null, user);

        });

    }));

};
