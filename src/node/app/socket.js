var logger = require('winston');
var TorrentsSocket = require('../torrents/torrents-socket');
var NotificationsSocket = require('../notifications/notifications-socket');

var users = 0;
var socketHandlers;

module.exports = function (io) {
	io.on('connection', function (socket) {
		logger.info('Client connected from remote address', socket.client.conn.remoteAddress);
		users++;
		logger.info('Clients connected', users);

		socketHandlers = {
			torrents: new TorrentsSocket(socket),
			notifications: new NotificationsSocket(socket)
		};

		for (var socketHandler in socketHandlers) {
			if (socketHandlers[socketHandler].eventHandler) {
				var eventHandler = socketHandlers[socketHandler].eventHandler;

				for (var event in eventHandler) {
					socket.on(event, eventHandler[event]);
				}
			}
		}

		socket.on('disconnect', function () {
			logger.info('Client disconnected.');
			users--;

			if (users === 0) {
				socketHandlers.notifications.stop();
			}

		});
	});
};
