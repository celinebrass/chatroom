// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local : {

        /*Each user must sign in with their phone number.  By indexing the "phoneNumber" and "session" field,
        queries on these fields become extremely fast.*/
        phoneNumber             : { type: String,  required: true,  unique: true, index: true },

        /*session code is how the client sends a request for a users data once they have logged in.
        This means they do not have to log in every time they open the app.*/
        session_code            : { type: String,  required: false,  unique: true,  index: true },
        session_expires         : { type: Date,    required: false,  unique: false, index: false},

        //Basic user info.  Password is stored as a hash value
        displayname             : { type: String,  required: false,  unique: true},
        password                : { type: String,  required: false,  unique: false, index: false },

        //Default save the current date as the creation date
        createdAt               : { type: Date,     required: true,  index: false,  default:  Date.now()}
    }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
