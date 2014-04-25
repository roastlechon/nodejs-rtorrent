define([
	"controllers",
	"services/FeedFactory",
	"services/TorrentFactory"
], function(controllers) {
	"use strict";
	controllers.controller("FeedController", ["$log", "$scope", "$stateParams", "FeedFactory", "TorrentFactory",
		function($log, $scope, $stateParams, FeedFactory, TorrentFactory) {
			console.log("feed controller loaded");
			
			FeedFactory.getFeed($stateParams.id).then(function(data) {
				$scope.feed = data;
			}, function(err) {
				$log.error(err);
			});

			$scope.pageTitle = "Feed";
			
			$scope.loadTorrent = function(torrent) {
				console.log("loading torrent");
				TorrentFactory.loadTorrent({
					"url": torrent.url
				}).then(function(data) {
					console.log(data);
				}, function(err) {
					console.log(err);
				});
			}
		}
	]);
});