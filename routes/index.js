var express = require('express');
var router = express.Router();

//require npm modules
var url = require('url');

//Load models
var User = require('../models/user');
var Message = require('../models/message');
var Group = require('../models/group');

//Load Controllers
var userController = require('../controllers/userController');
var groupController = require('../controllers/groupController');
var messageController = require('../controllers/messageController');

module.exports = function (){

    /*GET tes page*/
    router.get('/', function(req, res, next){
        res.json({message : "WOOOOO! YOU STARTED THE APP!"})
    })

    /* POST user login */
    router.post('/users/login', function(req, res, next){
        userController.login(req, res, next);
    });

    /* POST user registration */
    router.post('/users/register', function (req, res, next){
        userController.register(req, res, next);
    });

    /*GET all users */
    router.get('/users/all', authorizeGet, function (req, res, next){
        userController.getAllUsers(req, res, next);
    });

    /*GET all groups*/
    router.get('/groups/all', authorizeGet, function(req, res, next){
        console.log("authenticated, yo");
        groupController.getAllGroups(req, res, next);
    });

    /*POST create new group*/
    router.post('/groups/create', authorizePost, function(req, res, next){
        groupController.createGroup(req, res, next);
    });

    /*GET one group*/
    router.get('/groups/get', authorizeGet, function(req, res, next){
        console.log("in getgroup");
        groupController.getGroup(req, res, next);
    });

    /*POST new message*/
    router.post('/messages/send', authorizePost, function(req, res, next){
        messageController.sendMessage(req, res, next);
    })

    return router;
}

/* route middleware to make sure a user is logged in */
function authorizePost(req, res, next) {
    console.log(req.body);
    User.findOne({"local.session_code" : req.body.session_code}, function (err, userObj){
        console.log(userObj);
        if (err){
            res.status(500).json({
                message: "some error occured validating this request.",
                error : err
            });
        }
        else if (userObj){
            var expTime = userObj.local.session_expires.getTime();
            if (expTime < Date.now()) {
                res.status(401).json({
                    message : "This user's session has expired. Please login again."
                });
            }
            else {
                req.user = userObj;
                return next();
            }
        }
        else {
            res.status(401).json({
                message : "Invalid session code. Please log in."
            });
        }
    });
}

function authorizeGet(req, res, next){
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    User.findOne({"local.session_code" : query.session_code}, function (err, userObj){
        if (err){
            res.status(500).json({
                message: "some error occured validating this request.",
                error : err
            });
        }
        else if (userObj){
            var expTime = userObj.local.session_expires.getTime();
            if (expTime < Date.now()) {
                res.status(401).json({
                    message : "This user's session has expired. Please login again."
                });
            }
            else {
                req.user = userObj;
                return next();
            }
        }
        else {
            res.status(401).json({
                message : "Invalid session code. Please log in."
            });
        }
    });
}
