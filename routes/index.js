var express = require('express');
var router = express.Router();

//require npm modules

//get models
var User = require('../models/user');
var Game = require('../models/game');
var Pool = require('../models/pool');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});
/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.json("HelloWorld");
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.json(docs)
    });
});

/* GET Userlist page. */
router.get('/newUser', function(req, res) {
    var user = new User({
        phoneNumber:"17577630609",
        fName: "Celine",
        lname: "Brass",
        password: "GOTEAMMM"
    })

    user.save(function (err) {
        if (err){
            res.json(err)
        }
        else {
            res.json(user)
        }
    })
});

module.exports = router;
