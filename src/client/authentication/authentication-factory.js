module.exports = angular
	.module('authentication')
	.factory('Authentication', function(njrtLog, $http, $rootScope, $state, $window, Restangular, SessionService, $q) {

		var logger = njrtLog.getInstance('authentication.Authentication');

		logger.debug('Authentication loaded.');
		
		var Authentication = {};

		Authentication.login = function(user) {
			var deferred = $q.defer();

			$http.post("/login", user).then(function(data) {

				data = data.data;

				var userSession = {
					token: data.token,
					expires: data.expires,
					_id: data._id,
					email: user.email
				}
				SessionService.setUserSession(userSession);
				
				deferred.resolve(userSession);
			}, function(err) {
				SessionService.clearSession();
				deferred.reject(new Error(err.statusText));
			});

			return deferred.promise;
		};
		
		Authentication.logout = function() {
			SessionService.clearSession();
			$state.go('home');
		};
		
		Authentication.isAuthenticated = function() {
			if (SessionService.isCurrentSessionValid()) {
				return true;
			}

			return false;
		};
		
		Authentication.getCurrentUser = function() {
			return SessionService.getUserSession();
		};

		return Authentication;
	});