var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// Database
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/nodetest2", {native_parser:true});

var routes = require('./routes/index');
var schedules = require('./routes/schedules');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req, res, next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/schedules', schedules);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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

module.exports = app;

// Check if it's time to feed the cats every second
setInterval(function() {

    // Get the current time
    var date = new Date;

    // Convert current time to seconds, minutes, and hours
    var currentSecond = date.getSeconds();
    var currentMinute = date.getMinutes();
    var currentHour = date.getHours();

    // Get the schedules in the database
    db.collection('feedingschedule').find().toArray(function (err, items) {
        
        // Check each schedule in the database
        items.forEach(function(items) {

            // Convert database times to numbers for comparison with current time
            var second =0;
            var minute = parseInt(items.minute);
            var hour;
            
            if( parseInt(items.hour) == 12 ) {
                items.ampm == 'am' ? hour = 0 : hour = 12;
            } else {
                items.ampm == 'pm' ? hour = parseInt(items.hour) + 12 : hour = parseInt(items.hour);
            }

            // If the current time corresponds with a database entry, feed the cats
            if (second == currentSecond && minute == currentMinute && hour == currentHour) {
                console.log('Send a message to activate the servo! Feedin\' time is now!');
            }

        });
    });

}, 1000);
