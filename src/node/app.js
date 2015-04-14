var logger = require('winston');
var nconf = require('nconf');
var fs = require('fs');
var bodyParser = require('body-parser');
var multiparty = require('connect-multiparty');
var livereload = require('connect-livereload');
var multipartyMiddleware = multiparty();
var https = require('https');
var http = require('http');
var server;

nconf.env().argv().file('../../config.json');

var rtorrent = require('./lib/rtorrent');
logger.add(logger.transports.File, {
    filename: '../../nodejs-rtorrent.log'
});
logger.level = 'debug';
logger.exitOnError = false;

logger.info('Initializing nodejs-rtorrent server.');

if (nconf.get('app:database') === 'tingodb') {
  require('tungus');
}

var mongoose = require('mongoose');
var express = require('express');

var passport = require('passport');
require('./auth/passport/passport-strategy')(passport);

var auth = require('./auth/auth');
var app = express();

// Setup server options
if( nconf.get('app:ssl') ) {
	var serverOptions = {};
	serverOptions.cert	= fs.readFileSync( nconf.get('ssl:cert'), 'utf-8');
	serverOptions.key	= fs.readFileSync( nconf.get('ssl:key'), 'utf-8');
	server = https.createServer(serverOptions, app);
} else {
	server = http.createServer(app);
}

var io = require('socket.io')(server, {
  serverClient: false,
  origins: nconf.get('app:hostname') + ':' + nconf.get('app:port')
});

io.use(auth.isSocketAuthenticated);

// Check for config setting if app database is tingodb.
// By default app setting should be tingodb
if (nconf.get('app:database') === 'mongodb') {
  logger.info('Using mongodb for database.');

  var connectionString = nconf.get('mongodb:prefix') + nconf.get('mongodb:uri') + '/' + nconf.get('mongodb:database');
  logger.info('Connecting to ', connectionString);
  mongoose.connect(connectionString, function (err) {
    if (err) {
      logger.error(err.message);
      throw err;
    }
  });
} else {
  logger.info('Using tingodb for database.');
  logger.info('Connecting to tingodb');
  mongoose.connect('tingodb://' + __dirname + '/../../data', function (err) {
    if (err) {
      logger.error(err.message);
      throw err;
    }
  });
}

logger.info('Connected successfully to database.');

logger.info('Configuring default user');
var users = require('./users/users-model');
users.add(nconf.get('app:defaultUser')).then(function (data) {
  logger.info('Successfully created default user', data.email);
}, function (err) {
  if (err.message === 'User exists.') {
    logger.debug('User exists.');
  } else {
    logger.error(err.message);
  }
});

logger.info('Configuring Express.');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(passport.initialize());
app.use(livereload({
    port: 4002
  }));
app.use(express.static('../../dist'));
app.use(multipartyMiddleware);
app.use(function (req, res, next) {
  logger.info('Request from', req.connection.remoteAddress);
  next();
});
app.use(function (err, req, res, next) {
  console.log(err.stack);
  next();
});
app.use(function (err, req, res, next) {
  res.status(500);
  res.send(err);
});

var authRoute = require('./auth/auth-route');
var torrentsRoute = require('./torrents/torrents-route');
var feedsRoute = require('./feeds/feeds-route');
var settingsRoute = require('./settings/settings-route');

var router = express.Router();
var loginRouter = express.Router();

// authRoute does not use authentication
authRoute(loginRouter);
feedsRoute(router);
settingsRoute(router);
torrentsRoute(router);

app.use(loginRouter);
app.use(auth.isAuthenticated);
app.use(router);

var socket = require('./app/socket');
socket(io);

require('./feeds/feeds-subscriptions');
logger.debug('Starting subscription to feeds');

logger.debug('Listening on hostname and port: %s:%s', nconf.get('app:hostname'), nconf.get('app:port'));

rtorrent.init()
  .then(function () {
    server.listen(nconf.get('app:port'));
    logger.info('Successfully started nodejs-rtorrent.');
    logger.info('Open http://%s:%s in a browser and login with user \'%s\' and password \'%s\'.', nconf.get('app:hostname'), nconf.get('app:port'), nconf.get('app:defaultUser:email'), nconf.get('app:defaultUser:password'));
  }, function (err) {
    logger.error('An error occurred while starting nodejs-rtorrent.');
    throw err;
  })
  .done();
