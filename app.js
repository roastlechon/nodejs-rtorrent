var logger = require("winston");
var nconf = require("nconf");
nconf.env().argv().file("config/config.json");

var rtorrent = require("./lib/rtorrent");
logger.add(logger.transports.File, { filename: "nodejs-rtorrent.log"});
logger.exitOnError = false;

logger.info("initializing app.js");

var mongoose = require("mongoose");
var express = require("express");

var http = require("http");
var io = require("socket.io");

var passport = require("passport")

var pass = require("./config/pass");

var jwt = require("jwt-simple");
var secret = nconf.get("authentication:secret");


var app = express();
var server = http.createServer(app);
var io = io.listen(server);

logger.info("connecting to mongodb://localhost/nodejs-rtorrent");
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
  io.set("log level", 1);
  io.set("authorization", function(handshakeData, callback) {
    var queryToken = handshakeData.query.token;
    if (!queryToken) {
      logger.error("authorization token does not exist");
      return callback("authorization token does not exist");
    }

    var authenticationHeaderArray = queryToken.split(":");

    var clientUserId = authenticationHeaderArray[0];
    var clientExpires = authenticationHeaderArray[1];
    var clientToken = authenticationHeaderArray[2];

    var token = jwt.encode({
      _id: clientUserId + "",
      expires: clientExpires + ""
    }, secret);

    if (token === clientToken) {
      logger.info("authenticated via token");
      return callback(null, true);
    } else {
      logger.error("authentication token does not match");
      return callback(null, false);
    }

  });
});


logger.info("configuring express");
app.configure(function() {
	app.use(express.bodyParser());
  app.use(express.multipart());
  app.use(express.methodOverride());
	app.use(passport.initialize());
	app.use(app.router);
	app.use(express.static(__dirname + "/public"));
});

require("./controllers/socket")(io);
require("./controllers/login")(app);
require("./controllers/feeds")(app);
require("./controllers/torrent")(app);
require("./controllers/rss-subscriptions")();

logger.info("listening on port " + nconf.get("express:port"));

rtorrent.init();

server.listen(nconf.get("express:port"));