var express = require('express');
var router = express.Router();

//require npm modules

//Load models
var User = require('../models/user');
var Message = require('../models/message');
var Group = require('../models/group');

module.exports = function (passport){

    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
    });

        /* POST user login */
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    /* POST user registration */
    router.post('/register', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/register', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    return router;
}

/* route middleware to make sure a user is logged in */
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the login page
    res.status(401).json('"Message":"Login Failed."')
}
//Functions for creating new UUID's
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function createNewRefID() {
    var delim = '-';
    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
}

//module.exports = router;
