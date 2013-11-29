define([
	"services"
], function(serviceModule) {
	"use strict";
	return serviceModule.factory("AuthenticationFactory", function($http) {
		var isAuthenticated = false;
		var user = {
			_id: "",
			email: ""
		};
		var currentUser = user;

		return {
			login: function(user, success, error) {
				console.log(user);
				$http.post("/login", user).success(function(res) {
					isAuthenticated = true;
					console.log("response from login call");
					currentUser = res;
					console.log(res);
					success(res);
					console.log(currentUser);
				}).error(error);
			},
			logout: function(success, error) {
				$http.post("/logout").success(function(res) {
					console.log("logged out");
					console.log(res);
					currentUser = user;
					isAuthenticated = false;
					success(res);
				}).error(error);
			},
			isAuthenticated: function() {
				return isAuthenticated;
			},
			currentUser: function() {
				return currentUser;
			}
		};
	});
});