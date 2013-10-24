var rtorrent = require("../lib/rtorrent");
var logger = require("winston");
var torrents = [];
var connections = 0;
var started = false;
var interval = null;

module.exports = function(io) {
	io.sockets.on("connection", function(socket) {
		
		connections++;

		logger.info("successfully connected to socket");

		if (!started) {
			logger.info("starting torrent loop");
			startTorrentLoop();
		}

		socket.emit("user", {
			_id: socket.handshake.user._id,
			email: socket.handshake.user.email
		});

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
			rtorrent.getAll(function(list) {
				torrents = list;
			});
		} else {
			logger.info("stopping torrent loop");
			logger.info("waiting on connection");
			started = false;
			clearInterval(interval);
		}
	}, 3000);
}