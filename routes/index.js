var express = require('express');
var router = express.Router();

//require npm modules

//Load models
var User = require('../models/user');
var Message = require('../models/message');
var Group = require('../models/group');

//Load Controllers
var userController = require('../controllers/userController');

module.exports = function (){

    /* POST user login */
    router.post('/users/login', function(req, res, next){
        userController.login(req, res, next);
    });

    /* POST user registration */
    router.post('/users/register', function (req, res, next){
        userController.register(req, res, next);
    });

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
