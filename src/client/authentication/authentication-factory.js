function Authentication(njrtLog, $http, $state, SessionService, $q, Socket) {

	var logger = njrtLog.getInstance('njrt.authentication');

	logger.debug('Authentication loaded.');

	var Authentication = {};

	Authentication.login = function (user) {
		var deferred = $q.defer();

		$http.post("/login", user).then(function (data) {

			data = data.data;

			var userSession = {
				token: data.token,
				expires: data.expires,
				_id: data._id,
				email: user.email
			}
			SessionService.setUserSession(userSession);

			// Connect to socket
			Socket.connect();

			deferred.resolve(userSession);
		}, function (err) {
			SessionService.clearSession();
			deferred.reject(new Error(err.statusText));
		});

		return deferred.promise;
	};

	Authentication.logout = function () {
		SessionService.clearSession();

		Socket.disconnect();
		$state.go('top');
	};

	Authentication.isAuthenticated = function () {
		if (SessionService.isCurrentSessionValid()) {
			return true;
		}

		return false;
	};

	Authentication.getCurrentUser = function () {
		return SessionService.getUserSession();
	};

	return Authentication;
}

angular
	.module('njrt.authentication')
	.factory('njrt.Authentication', ['njrtLog', '$http', '$state', 'njrt.SessionService', '$q', 'Socket', Authentication]);
