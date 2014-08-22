var io = require("socket-io");
var serviceModule = require("../services");

serviceModule.factory("SocketFactory", function($rootScope, $window) {
	var socket = io.connect("/?token=" + $window.sessionStorage._id + ":" + $window.sessionStorage.expires + ":" + $window.sessionStorage.token, {
		"force new connection" : true,
		"sync disconnect on unload" : true
	});
	return {
		reconnect: function() {
			console.log("reconnecting to socket");
			socket = io.connect("/?token=" + $window.sessionStorage._id + ":" + $window.sessionStorage.expires + ":" + $window.sessionStorage.token, {
				"force new connection" : true,
				"sync disconnect on unload" : true
			});
		},
		disconnect: function() {
			console.log("disconnecting socket");
			socket.disconnect();
		},
		on: function (eventName, callback) {
			socket.on(eventName, function () {  
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	}
});