define([
	"controllers",
	"services/AuthenticationServices",
	"services/SocketFactory"
], function(controllers) {
	"use strict";
	controllers.controller("NavigationController", ["$scope", "$rootScope", "AuthenticationFactory", "SocketFactory",
		function($scope, $rootScope, AuthenticationFactory, SocketFactory) {
			console.log("navigation controller loaded");

			$scope.$watch(AuthenticationFactory.isAuthenticated, function(newVal, oldVal) {
				$scope.isAuthenticated = newVal;
			});
			
			$scope.$watch(AuthenticationFactory.currentUser, function(newVal, oldVal) {
				console.log(newVal);
				$scope.user = newVal;
			});

			$scope.logout = function() {
				AuthenticationFactory.logout(
					function(success) {
						console.log("successfully logged out");
						console.log(success);
					}, 
					function(error) {
						console.log("error occured logging out");
						console.log(error);
					}
				);
				
				SocketFactory.disconnect();
			}
		}
	]);
});