var controllersModule = require("../controllers");
controllersModule.controller("NavigationController", ["$scope", "$rootScope", "$state", "AuthenticationFactory", "SocketFactory",
	function($scope, $rootScope, $state, AuthenticationFactory, SocketFactory) {
		console.log("navigation controller loaded");

		$scope.logout = function() {
			console.log("logging out");
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

			$state.go("login");
		}
	}
]);