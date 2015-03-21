function Socket(njrtLog, $rootScope, $window) {

	var logger = njrtLog.getInstance('socket');

	logger.debug('Socket loaded.');

	var manager = io.Manager('/?token=' + $window.sessionStorage._id + ':' + $window.sessionStorage.expires + ':' + $window.sessionStorage.token, {
    reconnection: false
  });

	var socket = manager.socket('/');

	var Socket = {};

	Socket.connect = function () {
		logger.info('Connecting to socket.');
		socket.open();
	};

	Socket.disconnect = function () {
		logger.info('Disconnecting from socket.');
		socket.close();
	};

	Socket.on = function (eventName, callback) {
		socket.on(eventName, function () {
			var args = arguments;
			$rootScope.$apply(function () {
				callback.apply(socket, args);
			});
		});
	};

	Socket.emit = function (eventName, data, callback) {
		socket.emit(eventName, data, function () {
			var args = arguments;
			$rootScope.$apply(function () {
				if (callback) {
					callback.apply(socket, args);
				}
			});
		});
	};

	return Socket;

}

angular
	.module('njrt.socket')
	.factory('Socket', ['njrtLog', '$rootScope', '$window', Socket]);
