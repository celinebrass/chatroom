var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var gameSchema = new mongoose.Schema({

	datePlayed	: 	{ type: Date,  required: false,  unique: false },
	player      :
    [
        {
            playerId  : ObjectId,
            score    : Integer
        }
    ],
	createdOn	:	{ type: Date,    required: false,  unique: false, default: Date.now },
	//Each game can only be a part of one pool, even if its two players are in multiple pools together.
	pool		:	{ type: ObjectId, required: true,  uniqe : false}
});

// create and export to our app
module.exports = mongoose.model('Game', gameSchema);
