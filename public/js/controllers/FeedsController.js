define([
	"controllers",
	"services/FeedsFactory"
], function(controllers) {
	"use strict";
	controllers.controller("FeedsController", ["$scope", "$rootScope", "FeedsFactory", "$modal",
		function($scope, $rootScope, FeedsFactory, $modal) {
			console.log("feeds controller loaded");
			
			FeedsFactory.query(function(res) {
				console.log("successful response");
				console.log(res);
				$scope.feeds = res;
				$rootScope.$broadcast("loadedFeeds");
			}, function(error) {
				console.log("error occurred");
				console.log(error);
			});

			$scope.addFeed = function() {
				FeedsFactory.add({
					rss: $scope.feedUrl,
					title: $scope.feedName
				}, function(res) {
					console.log("successful response");
					console.log(res);
				}, function(error) {
					console.log("error occurred");
					console.log(error);
				});				
			}

			$scope.editFeed = function() {
				FeedsFactory.edit(
				$scope.feed.id, {
					rss: $scope.feedUrl,
					title: $scope.feedName
				}, function(res) {
					console.log("successful response");
					console.log(res);
				}, function(error) {
					console.log("error occurred");
					console.log(error);
				});
			}

			$scope.deleteFeed = function(index) {
				var modalInstance = $modal.open({
					templateUrl: "partials/modal_confirmation.html",
					controller: function($scope, $modalInstance, feed) {
						$scope.title = "Delete \"" + feed.title + "\"?";
						$scope.body = "Deleting will remove the feed from the list.";
						$scope.delete = function() {
							$modalInstance.close();
						}

						$scope.cancel = function() {
							$modalInstance.dismiss("cancel");
						}
					},
					resolve: {
						feed: function() {
							return $scope.feeds[index];
						}
					}
				});

				modalInstance.result.then(function() {
					console.log("deleted feed");
					FeedsFactory.del(
					$scope.feeds[index]._id, function(res) {
						console.log("successful response");
						console.log("splicing from feeds array");
						$scope.feeds.splice(index, 1);
						console.log(res);
					}, function(error) {
						console.log("error occurred");
						console.log(error);
					});
				}, function() {
					console.log("modal closed/rejected");
				});
			}
		}
	]);
});