define([
	"services"
], function(serviceModule) {
	"use strict";
	return serviceModule.factory("TorrentFactory", function($http) {
		return {
			action: function(action, success, error) {
				console.log("torrent action is %s", action.action);
				$http.post("/torrent", action).success(function (res) {
					success(res);
				}).error(error);
			}
		};
	});
});