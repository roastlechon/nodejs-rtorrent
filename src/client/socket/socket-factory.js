'use strict';

var io = require('socket-io');

function Socket (njrtLog, $rootScope, $window) {

	var logger = njrtLog.getInstance('socket');
	
	logger.debug('Socket loaded.');

	var socket = connect();

	var Socket = {};

	Socket.connect = function () {
		logger.info('Connecting to socket.');
		socket.connect();
	};

	Socket.reconnect = function () {
		logger.info('Reconnecting to socket.');
		socket = connect();
	};

	Socket.disconnect = function () {
		logger.info('Disconnecting from socket.')
		socket.disconnect();
	};

	Socket.on = function (eventName, callback) {
		socket.on(eventName, function () {  
			var args = arguments;
			$rootScope.$apply(function () {
				callback.apply(socket, args);
			});
		});
	};

	Socket.emit = function () {
		socket.emit(eventName, data, function () {
			var args = arguments;
			$rootScope.$apply(function () {
				if (callback) {
					callback.apply(socket, args);
				}
			});
		});
	};

	function connect () {
		return io.connect('/?token=' + $window.sessionStorage._id + ':' + $window.sessionStorage.expires + ':' + $window.sessionStorage.token);
	}

	connect();

	return Socket;

}

module.exports = angular
	.module('socket')
	.factory('Socket', ['njrtLog', '$rootScope', '$window', Socket]);