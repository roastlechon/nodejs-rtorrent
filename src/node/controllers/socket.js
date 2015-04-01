var logger = require("winston");
var nconf = require("nconf");
var rtorrent = require("../lib/rtorrent");

var torrents = [];
var notifications = [];
var connections = 0;
var started = false;



function startTorrentLoop() {
	started = true;
	var rtorrentLoopInterval = setInterval(function() {
		if (connections > 0) {
			rtorrent.getTorrents().then(function(data) {
				torrents = data;
			}, function(err) {
				logger.error(err.message);
			});
		} else {
			logger.info("Stopping torrent loop.");
			logger.info("Waiting on connection from client.");
			started = false;
			clearInterval(rtorrentLoopInterval);
		}
	}, nconf.get("app:rtorrentLoopInterval"));
}

var socket = module.exports = {};

socket.init = function (io) {
	io.on("connection", function(socket) {
		
		connections++;

		logger.info('User count:', connections);

		logger.info("Successfully connected to socket.");

		if (!started) {
			logger.info("Starting torrent loop.");
			startTorrentLoop();
		}

		var emitTorrents = function(callback) {
			socket.emit("torrents", torrents);
			callback();
		}

		var emitNotifications = function (callback) {
			if (notifications.length > 0) {
				socket.emit("notifications", notifications.pop());
			}
			callback();
			
		}

		var torrentTimeoutLoop = function() {
			setTimeout(function() {
				emitTorrents(torrentTimeoutLoop);
			}, 1000);
		}
		torrentTimeoutLoop();

		var notificationTimeoutLoop = function () {
			setTimeout(function() {
				emitNotifications(notificationTimeoutLoop);
			}, 1000);
		}
		notificationTimeoutLoop();

		socket.on("disconnect", function(socket) {
			logger.info("Client disconnected.");
			connections--;

			if (connections == 0) {
				started = false;
			}
		});
	});
}

socket.addNotification = function (notification) {
	notifications.push(notification);
}