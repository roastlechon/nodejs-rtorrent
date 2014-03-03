define([
	"controllers",
	"services/FeedsFactory",
	"services/TorrentFactory"
], function(controllers) {
	"use strict";
	controllers.controller("EditFeedController", ["$scope", "$rootScope", "$stateParams", "FeedsFactory", "TorrentFactory",
		function($scope, $rootScope, $stateParams, FeedsFactory, TorrentFactory) {
			console.log("edit feed controller loaded");
			
			FeedsFactory.single($stateParams.id, function(res) {
				console.log("successful response");
				console.log(res);
				$scope.feed = res;
			}, function(error) {
				console.log("error occurred");
				console.log(error);
			});

			$scope.editFeed = function() {
				FeedsFactory.edit(
				$scope.feed._id, {
					rss: $scope.feed.rss,
					title: $scope.feed.title
				}, function(res) {
					console.log("successful response");
					console.log(res);
				}, function(error) {
					console.log("error occurred");
					console.log(error);
				});
			}
		}
	]);
});