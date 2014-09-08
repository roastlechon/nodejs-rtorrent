var logger = require("winston");
var nconf = require("nconf");
nconf.env().argv().file("./config/config.json");

var rtorrent = require("./lib/rtorrent");
logger.add(logger.transports.File, { filename: "nodejs-rtorrent.log"});
logger.exitOnError = false;

logger.info("Initializing nodejs-rtorrent server.");

var mongoose = require("mongoose");
var express = require("express");

var http = require("http");
var io = require("socket.io");

var passport = require("passport")
require("./config/passport-strategy");

var socketAuthorization = require('./config/socket-authorization');

var app = express();
var server = http.createServer(app);
var io = io.listen(server);

logger.info("connecting to " + nconf.get("mongoose:prefix") + nconf.get("mongoose:uri") + "/" + nconf.get("mongoose:database"));

var connectionString = nconf.get("mongoose:prefix") + nconf.get("mongoose:uri") + "/" + nconf.get("mongoose:database");
mongoose.connect(connectionString);

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