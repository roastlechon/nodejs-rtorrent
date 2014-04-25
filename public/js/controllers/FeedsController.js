define([
	"controllers",
	"services/FeedFactory"
], function(controllers) {
	"use strict";
	controllers.controller("FeedsController", ["$log", "$scope", "$rootScope", "FeedFactory", "$modal",
		function($log, $scope, $rootScope, FeedFactory, $modal) {
			console.log("feeds controller loaded");
			
			$scope.pageTitle = "Feeds";

			FeedFactory.getFeeds().then(function(data) {
				$scope.feeds = data;
			}, function(err) {
				$log.error(err);
			});

			$scope.addFeed = function() {
				$modal.open({
					templateUrl: "../partials/add_feed_modal.html",
					controller: function($scope, $modalInstance) {
						$scope.feed = {};

						$scope.addFeed = function() {
							console.log($scope.feed);
							$scope.$close($scope.feed);
						}

						$scope.cancel = function() {
							$scope.$dismiss("cancel");
						}
					}
				}).result.then(function(data) {
					FeedFactory.addFeed({
						rss: data.url,
						title: data.name
					}).then(function(data) {
						console.log(data);
					}, function(err) {
						$log.error(err);
					});
				}, function(err) {
					$log.error(err);
				});
			}

			$scope.editFeed = function(feed) {
				console.log(feed);
				var modalInstance = $modal.open({
					templateUrl: "partials/edit_feed_modal.html",
					controller: function($scope, $modalInstance, feed) {
						$scope.feed = feed;
						$scope.title = "Edit \"" + feed.title + "\"";
						$scope.edit = function(feed) {
							$modalInstance.close(feed);
						}

						$scope.cancel = function() {
							$modalInstance.dismiss("cancel");
						}
					},
					resolve: {
						feed: function() {
							return feed;
						}
					}
				});

				modalInstance.result.then(function(data) {
					FeedFactory.updateFeed(data).then(function(data) {
						$log.debug(data);
					}, function(err) {
						$log.error(err);
					});
				}, function(err) {
					$log.error(err);
				});
			}

			$scope.deleteFeed = function(feed, index) {
				var modalInstance = $modal.open({
					templateUrl: "partials/modal_confirmation.html",
					controller: function($scope, $modalInstance, feed) {
						$scope.title = "Delete \"" + feed.title + "\"?";
						$scope.body = "Deleting will remove the feed from the list.";
						$scope.delete = function() {
							$modalInstance.close(feed);
						}

						$scope.cancel = function() {
							$modalInstance.dismiss("cancel");
						}
					},
					resolve: {
						feed: function() {
							return feed;
						}
					}
				});

				modalInstance.result.then(function(data) {
					FeedFactory.deleteFeed(feed).then(function(data) {
						console.log(data);
						$scope.feeds.splice(index, 1);
					}, function(err) {
						$log.error(err);
					});
				}, function(err) {
					console.log("modal closed/rejected");
					$log.error(err);
				});
			}
		}
	]);
});