var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var messageSchema = new mongoose.Schema({

	text    : 	{ type: String,  required: true,  unique: false },
	sender	: 	{ type: String,  required: true,  unique: false },
	group   :   { type: String,  required: true,  unique: false},

	createdOn	:	{ type: Date,    required: false,  unique: false, default: Date.now }
});

// create and export to our app
module.exports = mongoose.model('Message', messageSchema);
