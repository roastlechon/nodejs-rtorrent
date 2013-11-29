define([
	"services",
	"io"
], function(serviceModule, io) {
	"use strict";
	return serviceModule.factory("SocketFactory", function($rootScope) {
		var socket = io.connect("http://home.roastlechon.com:3000", {
			"force new connection" : true,
			"sync disconnect on unload" : true
		});
		return {
			reconnect: function() {
				console.log("reconnecting to socket");
				socket = io.connect("http://home.roastlechon.com:3000", {
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
});