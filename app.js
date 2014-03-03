var logger = require("winston");
var nconf = require("nconf");
nconf.env().argv().file("config/config.json");

var rtorrent = require("./lib/rtorrent");
logger.add(logger.transports.File, { filename: "nodejs-rtorrent.log"});
logger.exitOnError = false;

logger.info("initializing app.js");

var consolidate = require("consolidate");
var mongoose = require("mongoose");
var express = require("express");

var http = require("http");
var io = require("socket.io");

var passport = require("passport")

var seed = require("./config/seed");
var pass = require("./config/pass");

var jwt = require("jwt-simple");
var secret = nconf.get("authentication:secret");


var app = express();
var server = http.createServer(app);
var io = io.listen(server);

logger.info("connecting to mongodb://localhost/nodejs-rtorrent");
var connectionString = nconf.get("mongoose:prefix") + nconf.get("mongoose:uri") + "/" + nconf.get("mongoose:database");
mongoose.connect(connectionString);

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
	app.engine("html", consolidate.handlebars);
	app.set("view engine", "html");
	app.set("views", __dirname + "/views");
	app.use(express.bodyParser());
  app.use(express.multipart());
  app.use(express.methodOverride());
	app.use(passport.initialize());
	app.use(app.router);
	app.use(express.static(__dirname + "/public"));
});

require("./controllers/socket")(io);
require("./controllers/index")(app);
require("./controllers/login")(app);
require("./controllers/rssfeeds")(app);
require("./controllers/torrent")(app);
require("./controllers/rss-subscriptions")();

logger.info("listening on port " + nconf.get("express:port"));

rtorrent.init();

server.listen(nconf.get("express:port"));