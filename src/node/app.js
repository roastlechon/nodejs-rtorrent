var logger = require("winston");
var nconf = require("nconf");
var fs = require("fs");
nconf.env().argv().file("./config/config.json");

var rtorrent = require("./lib/rtorrent");
logger.add(logger.transports.File, { filename: "nodejs-rtorrent.log"});
logger.exitOnError = false;

logger.info("Initializing nodejs-rtorrent server.");

if (nconf.get("app:database") === "tingodb") {
  require('tungus');
}

var mongoose = require("mongoose");
var express = require("express");

var io = require("socket.io");

var passport = require("passport")
require("./config/passport-strategy");

var socketAuthorization = require('./config/socket-authorization');
var app = express();

// Setup server options
if( nconf.get("app:ssl") ) {
	var serverOptions = {};
	serverOptions.cert	= fs.readFileSync( nconf.get("app:ssl:cert"), 'utf-8');
	serverOptions.key	= fs.readFileSync( nconf.get("app:ssl:key"), 'utf-8');
	
	var http = require('https');
	var server = http.createServer(serverOptions, app);
} else {
	var http = require("http");
	var server = http.createServer(app);
}

var io = io.listen(server);

// Check for config setting if app database is tingodb.
// By default app setting should be tingodb
if (nconf.get("app:database") === "mongodb") {
  logger.info('Using mongodb for database.');

  var connectionString = nconf.get("mongodb:prefix") + nconf.get("mongodb:uri") + "/" + nconf.get("mongodb:database");
  logger.info("Connecting to ", connectionString);
  mongoose.connect(connectionString, function (err) {
    if (err) {
      logger.error(err.message);
      throw err;
    }
  });
} else {
  logger.info('Using tingodb for database.');
  logger.info('Connecting to tingodb');
  mongoose.connect("tingodb://" + __dirname + "/../../data", function (err) {
    if (err) {
      logger.error(err.message);
      throw err;
    }
  });
}

logger.info('Connected successfully to database.');

logger.info("Configuring default user");
var users = require("./models/users");
users.add(nconf.get("app:defaultUser")).then(function(data) {
  logger.info(data);
  logger.info("Successfully created default user");
}, function(err) {
  logger.error(err);
});

io.configure(function() {
  io.set("origins", nconf.get("app:hostname") + ":" + nconf.get("app:port"));
  io.set("log level", 1);
  io.set("authorization", socketAuthorization);
});


logger.info("Configuring express.");
app.configure(function() {
	app.use(express.bodyParser());
  app.use(express.multipart());
  app.use(express.methodOverride());
	app.use(passport.initialize());
	app.use(app.router);
  // need to configure option to allow for static or separate hosting
	app.use(express.static("../../dist"));
});

require("./controllers/socket")(io);
require("./controllers/login")(app);
require("./controllers/feeds")(app);
require("./controllers/torrent")(app);
require("./controllers/rss-subscriptions")();

logger.info("Listening on hostname and port: %s:%s", nconf.get("app:hostname"), nconf.get("app:port"));

rtorrent.init();

server.listen(nconf.get("app:port"));
