var io = require('socket-io');

module.exports = angular
	.module('socket')
	.factory('Socket', function(njrtLog, $rootScope, $window) {
		var logger = njrtLog.getInstance('Socket');
		
		logger.debug('SocketFactory loaded.');

		var socket = connect();

		var Socket = {};

		Socket.connect = function() {
			logger.debug('Connecting to socket.');
			socket = connect();
		}

		Socket.reconnect = function() {
			logger.debug('Reconnecting to socket.');
			socket = connect();
		}

		Socket.disconnect = function() {
			logger.debug('Disconnecting from socket.')
			socket.disconnect();
		}

		Socket.on = function(eventName, callback) {
			socket.on(eventName, function () {  
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		}

		Socket.emit = function() {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		}

		function connect() {
			logger.debug('Initializing connection to socket.');
			return io.connect('/?token=' + $window.sessionStorage._id + ':' + $window.sessionStorage.expires + ':' + $window.sessionStorage.token, {
				'force new connection': true,
				'sync disconnect on unload': true
			});
		}

		return Socket;

	});