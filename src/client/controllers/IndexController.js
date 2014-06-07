var controllersModule = require("../controllers");
controllersModule.controller("IndexController", ["$scope", "$rootScope", "AuthenticationFactory",
	function($scope, $rootScope, AuthenticationFactory) {
		$rootScope.pageTitle = "nodejs-rtorrent";
		console.log("index controller loaded");
		
	}
]);