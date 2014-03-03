define([
	"controllers",
	"services/AuthenticationFactory",
	"services/SocketFactory"
], function(controllers) {
	"use strict";
	controllers.controller("LoginController", ["$scope", "$rootScope", "$location", "$window", "AuthenticationFactory", "SocketFactory",
		function($scope, $rootScope, $location, $window, AuthenticationFactory, SocketFactory) {
			console.log("login controller loaded");

			$scope.login = function() {
				AuthenticationFactory.login({
						email: $scope.email,
						password: $scope.password
					}, function(response) {
						console.log("callback from logging in");
						console.log(response);
						console.log("logged in");
						SocketFactory.reconnect();
					}, function(error) {
						console.log(error);
						$rootScope.error = "Failed to login";
					}
				);
			}
		}
	]);
});