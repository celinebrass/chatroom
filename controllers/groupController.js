var async = require('async');
var url = require('url');

var Group = require('../models/group');
var User = require('../models/user');
var Message = require('../models/message');


module.exports = {
    getAllGroups : function(req, res, next){
        console.log("here");
        async.waterfall([ function (done){
            console.log(req.user._id);
            Group.find({"members" : req.user._id}, function (err, groups){
                console.log(groups);
                if (err){
                    res.status(500).json({
                        "message" : "Some error occurred.",
                        "error" : err
                    });
                }
                else {
                    done(null, groups)
                }
            })
        }, function (groups, done){
            var groupObjs = [];
            async.forEach(groups, function(group, callback){
                var groupObj = {};
                groupObj.name = group.name;
                groupObj.id = group.id;
                var members = [];
                async.forEach(group.members, function(memberId, callback2){
                    User.findById(memberId, function (err, userObj){
                        if (err) {
                            throw err;
                        }
                        else if (userObj){
                            members.push(userObj);
                        }
                        callback2();
                    });
                }, function (err){
                    groupObj.members = members.map(filterUser);
                    groupObjs.push(groupObj);
                    callback();
                });
            }, function (err){
                done(err, groupObjs)
            });
        }, function (groupObjs, done){
            res.status(200).json({
                "status" : "success",
                "groups" : groupObjs
            });
        }])
    },
    createGroup : function (req, res, next){
        var newGroup = new Group({
            name : req.body.name,
            members : req.body.members
        });
        newGroup.save(function (err){
            if (err){
                res.status(500).json({
                    "message" : "Some error occured while saving this group.",
                    "error" : err
                });
            }
            else {
                res.status(200).json({
                    status : "success",
                    group : newGroup.id
                });
            }
        })

    },

    getGroup : function(req, res, next){
        console.log("in controller");
        console.log(req.url);
        var url_parts = url.parse(req.url, true);
        console.log("got heeeere");
        var query = url_parts.query;
        console.log("got here");
        console.log(query);
        var groupId = query.groupId;
        console.log(groupId);
        async.waterfall([
            function (done){
                Group.findById(groupId, function(err, groupObj){
                    if (err){
                        res.status(500).json({
                            message: "Some error occurred.",
                            error : err
                        });
                    }
                    else if (groupObj){
                        console.log("found groupObj")
                        if (groupObj.members.indexOf(req.user.id) != -1){
                            done(err, groupObj);
                        }
                        else {
                            res.status(401).json({
                                "message" : "You are not a member of this group."
                            });
                        }
                    }
                    else{
                        res.status(404).json({
                            message : "We could not find this group."
                        });
                    }
                });
            }, function(groupObj, done){
                var messageObj = [];
                Message.find({group : groupObj.id}, function(err, messages){
                    console.log(err);
                    console.log(messages);
                    if (err){
                        console.log(err);
                        res.status(500).json({
                            message: "Some error occurred.",
                            error : err
                        });
                    }
                    else {
                        var messageObjs = [];
                        console.log("in messages");
                        async.forEach(messages, function(message, callback){
                            var messObj = {};
                            User.findById(message.sender, function (err, userObj){
                                if (err) {
                                    throw err;
                                    callback();
                                }
                                else {
                                    messObj = {
                                        "text" : message.text,
                                        "sender" : userObj.local.displayName,
                                        "senderId" : userObj.id,
                                        "sentOn" : message.created_on
                                    }
                                    messageObjs.push(messObj);
                                    callback();
                                }
                            });
                        }, function (err){
                            done(err, groupObj, messageObjs)
                        });
                    }
                })
            }, function(groupObj, messageObjs, done){
                res.status(200).json({
                    status: "success",
                    id : groupObj.id,
                    messages : messageObjs,
                    name : groupObj.name
                });
            }
        ])

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
