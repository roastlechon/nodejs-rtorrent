define([
	"controllers",
	"services/AuthenticationFactory"
], function(controllers) {
	"use strict";
	controllers.controller("IndexController", ["$scope", "$rootScope", "AuthenticationFactory",
		function($scope, $rootScope, AuthenticationFactory) {
			console.log("index controller loaded");
			
		}
	]);
});