var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var schedules = require('./routes/schedules');

var net = require('net');

var app = express();

// socket.io setup
var server = require('http').Server(app);
var io = require('socket.io')(server);

// socket.io listening on port 8888
server.listen(8888);

// ORM (Object Relational Mapper) 
var Sequelize = require('sequelize');

// Bootstrap the database
var sequelize = new Sequelize('Oscar', 'username', '', {
    dialect: 'sqlite',
    storage: './data/Oscar.sqlite'
});

// Define ORM Objects
var Schedule = sequelize.define('Schedule', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hour: {
        type: Sequelize.INTEGER
    }, minute: {
        type: Sequelize.INTEGER
    }, ampm: {
        type: Sequelize.STRING
    }
});

Schedule.sync().success(function() {
    console.log("Your database is ready.");
});

var Database = {
    'Schedule': Schedule
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname + '/bower_components')));

// Make our db accessible to our router
app.use(function(req, res, next){
    req.db = Database;
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

// socket.io listener
io.sockets.on('connection', function (socket) {

    // slider change event
    socket.on('feed now', function () {

        // Future: choose amount of food to feed the cats. Feed one unit for now.
        var feedPortion = {
            portion: 1
        };

        // Open a socket to communicate with servo control python process
        var socket = new net.Socket();
        socket.connect(50007, '127.0.0.1');

        socket.on('error', function(err) {
            console.log('Error code: ' + err.code);
        });

        socket.write(JSON.stringify(feedPortion));

        socket.end();
    });
});
// Check if it's time to feed the cats every second
setInterval(function() {

    // Get the current time
    var date = new Date;

    // Convert current time to minutes and hours
    var currentMinute = date.getMinutes();
    var currentHour = date.getHours();

    function applySchedule(schedule) {
        // Convert database times to numbers for comparison with current time
        var minute = parseInt(schedule.minute);
        var hour;
        
        if( parseInt(schedule.hour) == 12 ) {
            schedule.ampm == 'am' ? hour = 0 : hour = 12;
        } else {
            schedule.ampm == 'pm' ? hour = parseInt(schedule.hour) + 12 : hour = parseInt(schedule.hour);
        }

        // If the current time corresponds with a database entry, feed the cats
        if (minute == currentMinute && hour == currentHour) {

            console.log('Send a message to activate the servo! Feedin\' time is now!');

            // Future: choose amount of food to feed the cats. Feed one unit for now.
            var feedPortion = {
                portion: 1
            };

            // Open a socket to communicate with servo control python process
            var socket = new net.Socket();
            socket.connect(50007, '127.0.0.1');

            socket.on('error', function(err) {
                console.log('Error code: ' + err.code);
            });

            socket.write(JSON.stringify(feedPortion));

            socket.end();
        }
    }

    Schedule
        .findAll()
        .success(function(schedules) {
            schedules.forEach(function(schedule) {
                applySchedule(schedule);
            });
        });
}, 60000);

module.exports = app;
