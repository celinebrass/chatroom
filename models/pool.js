var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

/* A Pool is a group of players who play against eachother and are ranked against eachother.*/
var poolSchema = new mongoose.Schema({

	name      	: 			{ type: String,  required: true,   unique: false },
	players     :           [{type: ObjectId, required: true,  unique: false}],
	createdOn	:			{ type: Date,    required: false,  unique: false, default: Date.now },
	pool		:			{ type: ObjectId, required: true,  uniqe : false}
});

// create and export to our app
module.exports = mongoose.model('Pool', poolSchema);
