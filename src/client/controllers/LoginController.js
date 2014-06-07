var controllersModule = require("../controllers");
controllersModule.controller("LoginController", ["$scope", "$rootScope", "$location", "$window", "AuthenticationFactory", "SocketFactory", "$state",
	function($scope, $rootScope, $location, $window, AuthenticationFactory, SocketFactory, $state) {
		console.log("login controller loaded");

		$scope.user = AuthenticationFactory.currentUser();

		$scope.login = function() {
			AuthenticationFactory.login({
					email: $scope.email,
					password: $scope.password
				}, function(response) {
					console.log("callback from logging in");

					console.log(response);
					console.log("logged in");
					SocketFactory.reconnect();
					$state.go("torrents");
				}, function(error) {
					console.log(error);
					$rootScope.error = "Failed to login";
				}
			);
		}

		$scope.logout = function() {
			AuthenticationFactory.logout(function(response) {
					console.log("callback from logging out");
					console.log(response);
					$state.go("login");
				}, function(error) {
					console.log(error);
				});
		}
	}
]);