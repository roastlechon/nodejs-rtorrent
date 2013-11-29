var logger = require("winston");
var rtorrent = require("./lib/rtorrent");
logger.add(logger.transports.File, { filename: "nodejs-rtorrent.log"});
logger.exitOnError = false;

logger.info("initializing app.js");

var consolidate = require("consolidate");
var mongoose = require("mongoose");
var express = require("express");
var upload = require("jquery-file-upload-middleware");
var http = require("http");
var io = require("socket.io");

var passport = require("passport")
var SessionStore = require("session-mongoose")(express);
var passportSocketIo = require("passport.socketio");

var db = require("./config/db");
var pass = require("./config/pass");

var store = new SessionStore({
    connection: mongoose.connection
});



var app = express();
var server = http.createServer(app);
var io = io.listen(server);

io.configure(function() {
  io.set("log level", 1);
  io.set("authorization", passportSocketIo.authorize({
    cookieParser: express.cookieParser,
    key: "express.sid",
    secret: "keyboard cat",
    store: store,
    fail: function(data, accept) {
      logger.info("failed to authenticate to socket")
      accept(null, false);
    },
    success: function(data, accept) {
      logger.info("successfully authenticated to socket");
      accept(null, true);
    }
  }));
});

upload.configure({
	uploadDir: __dirname + "/public/uploads",
	uploadUrl: "/uploads"
});


logger.info("configuring express");
app.configure(function() {
	app.engine("html", consolidate.handlebars);
	app.set("view engine", "html");
	app.set("views", __dirname + "/views");
	app.use("/torrent/upload", upload.fileHandler());
  app.use(express.cookieParser());
	app.use(express.bodyParser());
  app.use(express.methodOverride());
	app.use(express.session({
    store: store,
    cookie: {
      maxAge: 900000
    },
    key: "express.sid",
		secret: "keyboard cat"
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(express.static(__dirname + "/public"));
});

require("./controllers/socket")(io);
require("./controllers/index")(app);
require("./controllers/login")(app);
require("./controllers/rssfeeds")(app);
require("./controllers/torrent")(app, upload);
require("./controllers/rss-subscriptions")();

logger.info("listening on port 3000");

rtorrent.init();

server.listen(3000);