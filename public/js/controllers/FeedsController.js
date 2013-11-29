define([
	"controllers",
	"services/FeedsServices",
	"services/TorrentServices"
], function(controllers) {
	"use strict";
	controllers.controller("FeedsController", ["$scope", "FeedsFactory", "TorrentFactory",
		function($scope, FeedsFactory, TorrentFactory) {
			console.log("feeds controller loaded");
			$scope.feeds = FeedsFactory.query();

			$scope.loadTorrent = function(torrent) {
				TorrentFactory.action({
					action: "load",
					url: torrent.url
				}, function(res) {
					console.log("successful response");
					console.log(res);
				}, function(error) {
					console.log("error occured");
					console.log(error);
				});
				console.log("loading torrent");
			}
		}
	]);
});