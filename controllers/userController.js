var User = require('../models/user');


module.exports = {

    login: function(req, res, next){
        User.findOne({'local.phoneNumber' : req.body.phoneNumber}, function(err, userObj){
            if (err){
                res.status(500).json({
                    message: "Some error occurred while finding this user.",
                    error : err
                });
            }
            else if (userObj){
                if (userObj.validPassword(req.body.password)){
                    var newExpireTime = Date.now() + 2*24*60*60*1000;
                    var newExpireDate = new Date(newExpireTime);
                    var newSessionCode = createNewSessionID();
                    userObj.local.session_code = newSessionCode;
                    userObj.local.session_expires = newExpireDate;
                    userObj.save(function (err){
                        if (err) {
                            res.status(500).json({
                                message : "An error occurred while updating the user's session."
                            });
                        }
                        else {
                            console.log(userObj);
                            var user = filterUser(userObj);
                            res.status(200).json({
                                status: "success",
                                user: user,
                                session_code : newSessionCode
                            });
                        }
                    });
                }
                else {
                    res.status(401).json({
                        "message" : "Invalid login info."
                    });
                }
            }
            else {
                res.status(403).json({
                    "message" : "User not found."
                });
            }
        });
    },

    register : function(req, res, next){
        console.log("in2");
        User.findOne({'local.phoneNumber' : req.body.phoneNumber}, function (err, userObj){
            if (err){
                res.status(500).json({
                    "message":"Some error occurred",
                    "err" : err
                });
            }
            else if (userObj){
                res.status(403).json({"message":"This phone number is already in use."});
            }
            else {
                var expireTime = Date.now() + 2*24*60*60*1000
                var expireDate = new Date(expireTime)
                var newSessionCode = createNewSessionID();
                var newUser = new User({
                    "local.phoneNumber" : req.body.phoneNumber,
                    "local.displayName" : req.body.displayName,
                    "local.session_code": newSessionCode,
                    "local.session_expires" : expireDate
                });
                console.log("in3");
                newUser.local.password = newUser.generateHash(req.body.password);
                newUser.save(function(err){
                    console.log("in4");
                    if (err){
                        res.status(500).json({
                            "message": "Some error occurred saving the user.",
                            "error" : err
                        });
                    }
                    else {
                        var user = filterUser(newUser);
                        res.status(200).json({
                            "user" : user,
                            "session_code" : newSessionCode
                        });
                    }
                })
            }
        });
    },

    getAllUsers : function(req, res, next){
        User.find({}, function(err, users) {
            if (err){
                res.status(500).json({
                    "message" : "Some internal error occurred."
                });
            }
            else {
                var filteredUsers = users.map(filterUser);
                res.status(200).json({
                    users : filteredUsers
                });
            }
        });
    }
}

function filterUser(user){
    var filteredUser = {
        "id" : user.id,
        "displayName" : user.local.displayName,
        "phoneNumber" : user.local.phoneNumber
    };

    return filteredUser;
}
//Functions for creating new SessionId's
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function createNewSessionID() {
    var delim = '-';
    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
}
