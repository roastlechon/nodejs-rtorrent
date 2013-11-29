define([
	"controllers",
	"services/FeedServices",
	"services/TorrentServices"
], function(controllers) {
	"use strict";
	controllers.controller("FeedController", ["$scope", "$stateParams", "FeedFactory", "TorrentFactory",
		function($scope, $stateParams, FeedFactory, TorrentFactory) {
			console.log("feed controller loaded");
			$scope.feed = FeedFactory.get({
				id: $stateParams.id
			});
			
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