var serviceModule = require("../services");

serviceModule.factory("AuthenticationInterceptor", function($rootScope, $q, $location, $window) {
	return {
		request: function(config) {
			config.header = config.headers || {};
			if ($window.sessionStorage.token) {
				config.headers.Authorization = "Bearer " + $window.sessionStorage._id + ":" + $window.sessionStorage.expires + ":" + $window.sessionStorage.token;
			}
			return config;
		},
		response: function(response) {

			return response || $q.when(response);
		}, 
		responseError: function(response) {
			console.log(response);
			if (response.status === 401) {
				console.log("response status returned 401, redirecting to login");
				$location.path("/login");
			}
			return $q.reject(response);
		}
	};
});