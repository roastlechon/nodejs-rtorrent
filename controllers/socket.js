var rtorrent = require("../lib/rtorrent");
var logger = require("winston");

module.exports = function(io) {
	io.sockets.on("connection", function(socket) {
		logger.info("successfully connected to socket");
		socket.emit("user", {
			_id: socket.handshake.user._id,
			email: socket.handshake.user.email
		});

		var getTorrents = function(callback) {
			rtorrent.getAll(function(list) {
				socket.emit("torrents", list);
			});
			callback();
		}

		var continueEmitting = function() {
			setTimeout(function() {
				getTorrents(continueEmitting);
			}, 1000);
		}
		continueEmitting();
	});
}