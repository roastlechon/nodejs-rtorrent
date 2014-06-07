var serviceModule = require("../services");

serviceModule.factory("AuthenticationFactory", function($http, $rootScope, $state, $window) {
	var isAuthenticated = false;
	var currentUser = {
		email: $window.sessionStorage.email,
		_id: $window.sessionStorage._id,
		token: $window.sessionStorage.token,
		expires: $window.sessionStorage.expires
	}

	if (currentUser.token && currentUser.email) {
		isAuthenticated = true;
		$rootScope.currentUser = currentUser;
		$rootScope.isAuthenticated = isAuthenticated;
	}

	$rootScope.$on("$stateChangeSuccess", function(event, toState) {
		if (!isAuthenticated) {
			event.preventDefault();
			$state.go("login");
		}

	});

	return {
		login: function(user, success, error) {
			console.log(user);
			$http.post("/login", user).success(function(res) {
				currentUser.token = $window.sessionStorage.token = res.token;
				currentUser.expire = $window.sessionStorage.expires = res.expires;
				currentUser._id = $window.sessionStorage._id = res._id;
				currentUser.email = $window.sessionStorage.email = user.email;
				isAuthenticated = true;

				$rootScope.currentUser = currentUser;
				$rootScope.isAuthenticated = isAuthenticated;

				success(res);
			}).error(error);
		}, logout: function(success, error) {
			$window.sessionStorage.clear();
			isAuthenticated = false;
			$rootScope.currentUser = currentUser;
			$rootScope.isAuthenticated = isAuthenticated;

			success("ok");

			// $http.post("/logout").success(function(res) {
			// 	console.log("logged out");
			// 	isAuthenticated = false;
			// 	success(res);
			// }).error(error);
		}, isAuthenticated: function() {
			console.log("checking if authenticated");
			return isAuthenticated;
		}, currentUser: function() {
			console.log("getting current user");
			return currentUser;
		}
	};
});