var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var groupSchema = new mongoose.Schema({

	name      	: 			{ type: String,  required: true,   unique: false },
	members     :           [{type: ObjectId, required: true,  unique: false}],
	createdOn	:			{ type: Date,    required: false,  unique: false, default: Date.now }

});

// create and export to our app
module.exports = mongoose.model('Group', groupSchema);
