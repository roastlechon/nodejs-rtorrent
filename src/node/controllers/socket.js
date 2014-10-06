var rtorrent = require("../lib/rtorrent");
var logger = require("winston");
var torrents = [];
var connections = 0;
var started = false;
var interval = null;
var nconf = require("nconf");

module.exports = function(io) {
	io.sockets.on("connection", function(socket) {
		
		connections++;

		logger.info("successfully connected to socket");

		if (!started) {
			logger.info("starting torrent loop");
			startTorrentLoop();
		}

		var getTorrents = function(callback) {
			socket.emit("torrents", torrents);
			callback();
		}

		var continueEmitting = function() {
			setTimeout(function() {
				getTorrents(continueEmitting);
			}, 1000);
		}
		continueEmitting();

		socket.on("disconnect", function(socket) {
			logger.info("user disconnected");
			connections--;
		});
	});
}


var startTorrentLoop = function() {
	started = true;
	interval = setInterval(function() {
		if (connections > 0) {
			rtorrent.getTorrents().then(function(data) {
				torrents = data;
			}, function(err) {
				logger.error(err.message);
			});
		} else {
			logger.info("stopping torrent loop");
			logger.info("waiting on connection");
			started = false;
			clearInterval(interval);
		}
	}, nconf.get("app:rtorrentLoopInterval"));
}