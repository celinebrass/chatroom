var Message = require('../models/message');

module.exports = {
    sendMessage : function(req, res, next){
        console.log("in message");
        console.log(req.body);
        console.log(req.user);
        console.log(req.user.id);
        var newMessage = new Message({
            text : req.body.text,
            sender : req.user.id,
            group : req.body.group
        })
        newMessage.save(function(err){
            console.log(err);
            if (err){
                console.log(err);
                res.status(500).json({
                    message : "Some errror occurred.",
                    error : err
                });
            }
            else {
                console.log("wtf");
                res.status(200).json({
                    status : "success"
                });
            }
        });
    }
}
