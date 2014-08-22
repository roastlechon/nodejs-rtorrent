var controllersModule = require("../controllers");
controllersModule.controller("LogoutController", ["$scope", "$rootScope", "$location", "$window", "AuthenticationFactory", "SocketFactory", "$state",
	function($scope, $rootScope, $location, $window, AuthenticationFactory, SocketFactory, $state) {
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