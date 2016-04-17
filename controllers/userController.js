var User = require('../models/user');

module.exports = {

    login: function(req, res, next){
        User.findOne({'local.phoneNumber' : req.body.phoneNumber}, function(err, userObj){
            if (err){
                res.status(500).json({
                    message: "Some error occurred."
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
                            delete userObj.local.password;
                            res.status(200).json({
                                status: "success",
                                user: userObj.local
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

    register: function(req, res, next){
        User.findOne({'local.phoneNumber' : req.body.phoneNumber}, function (err, userObj){

            if (err){
                res.status(500).json({"message":"Some error occurred"});
            }
            else if (userObj){
                res.status(403).json({"message":"This phone number is already in use."});
            }
            else {
                var expireTime = Date.now() + 2*24*60*60*1000
                var expireDate = new Date(expireTime)
                console.log(req);
                console.log(req.body.phoneNumber);
                var newUser = new User({
                    "local.phoneNumber" : req.body.phoneNumber,
                    "local.displayName" : req.body.displayName,
                    "local.session_code": createNewSessionID(),
                    "local.session_expires" : expireDate,
                });
                newUser.local.password = newUser.generateHash(req.body.password);
                newUser.save(function(err){
                    if (err){
                        console.log(err);
                        res.status(500).json({
                            "message": "Some error occurred saving the user",
                            "error" : err
                        });
                    }
                    else {
                        delete newUser.local.password;
                        res.status(200).json({
                            "user" : newUser.local
                        });
                    }
                })
            }
        });
    }
}

//Functions for creating new SessionId's
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function createNewSessionID() {
    var delim = '-';
    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
}
