var serviceModule = require("../services");

serviceModule.factory("AuthenticationFactory", function($http, $rootScope, $state, $window, Restangular, SessionService, $q) {
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
		login: function(user) {
			var deferred = $q.defer();

			$http.post("/login", user).then(function(data) {
				var userSession = {
					token: data.token,
					expires: data.expires,
					_id: data._id,
					email: data.email
				}
				SessionService.setUserSession(userSession);
				
				deferred.resolve(userSession);
			}, function(err) {
				deferred.reject(new Error(err.statusText));
			});

			return deferred.promise;
			// success(function(res) {
			// 	currentUser.token = $window.sessionStorage.token = res.token;
			// 	currentUser.expire = $window.sessionStorage.expires = res.expires;
			// 	currentUser._id = $window.sessionStorage._id = res._id;
			// 	currentUser.email = $window.sessionStorage.email = user.email;
				

			// 	$rootScope.currentUser = currentUser;
			// 	$rootScope.isAuthenticated = isAuthenticated;

			// 	success(res);
			// }).error(error);
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