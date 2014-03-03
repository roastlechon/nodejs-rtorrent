define([
	"controllers"
], function(controllers) {
	"use strict";
	controllers.controller("NotificationsController", ["$scope", "$rootScope",
		function($scope, $rootScope) {
			console.log("notifications controller loaded");

			$rootScope.$on("loadedFeeds", function(event) {
				console.log("loaded feeds");
			});

		}
	]);
});