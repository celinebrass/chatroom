var express = require('express');
var router = express.Router();

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var configDB = require('./config/database.js');
var mongoose = require('mongoose');
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

var sessionStore = new session.MemoryStore();

// New Code
var mongo = require('mongodb');
var monk = require('monk');

//var db = monk('localhost:27017/PongStats');

var db = monk('ec2-54-200-11-149.us-west-2.compute.amazonaws.com:27017/dummyDB');

var routes = require('./routes/index');
var users = require('./routes/users');

//Load Config files
mongoose.connect(configDB.url);
require('./config/passport')(passport); // pass passport for configuration

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({
    key: 'connect.sid',
    secret: 'ilovescotchscotchyscotchscotch',
    store: sessionStore,
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

var routes = require('./routes/index')(passport);

app.use('/', routes);
app.use('/users', users);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

//var server = http.createServer(app);
var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port + ' and address ' + server.address().address);
});


// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
