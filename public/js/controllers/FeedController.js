define([
	"controllers",
	"services/FeedFactory",
	"services/TorrentFactory"
], function(controllers) {
	"use strict";
	controllers.controller("FeedController", ["$log", "$scope", "$stateParams", "FeedFactory", "TorrentFactory",
		function($log, $scope, $stateParams, FeedFactory, TorrentFactory) {
			var logger = $log.getInstance("FeedController");

			logger.debug("FeedController loaded");
			
			FeedFactory.getFeed($stateParams.id).then(function(data) {
				$scope.feed = data;
			}, function(err) {
				$log.error(err);
			});

			$scope.pageTitle = "Feed";
			
			$scope.loadTorrent = function(torrent) {
				logger.info("Loading torrent");
				TorrentFactory.loadTorrent({
					"url": torrent.url
				}).then(function(data) {
					logger.debug(data);
				}, function(err) {
					logger.error(err);
				});
			}
		}
	]);
});