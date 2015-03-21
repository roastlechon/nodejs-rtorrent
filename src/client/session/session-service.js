function SessionService (njrtLog, $window, Restangular) {

	var logger = njrtLog.getInstance('njrt.session');

	logger.debug('SessionService loaded.');

	var userSession = {};

	// State user is intended to go to if presented with a login screen
	this.destinationState = '';

	// expects token, expires, id, email
	this.setUserSession = function (data) {
		userSession = data;

		$window.sessionStorage.email = data.email;
		$window.sessionStorage._id = data._id;
		$window.sessionStorage.token = data.token;
		$window.sessionStorage.expires = data.expires;

		Restangular.setDefaultHeaders({
			Authorization: this.getAuthorizationHeader()
		});
	}

	this.getUserSession = function () {
		return userSession;
	}

	this.clearSession = function () {
		// Remove default headers when clearing session.
		Restangular.setDefaultHeaders({});

		$window.sessionStorage.clear();
		userSession = {};
	}

	this.isCurrentSessionValid = function () {
		if (!_.isEmpty(userSession)) {
			return true;
		}

		return false;
	}

	this.getAuthorizationHeader = function () {
		var authorizationHeader = 'Bearer ' + userSession._id + ':' + userSession.expires + ':' + userSession.token;
		logger.debug('Authorization header:', authorizationHeader);
		//config.headers.Authorization = 'Bearer ' + $window.sessionStorage._id + ':' + $window.sessionStorage.expires + ':' + $window.sessionStorage.token;
		return authorizationHeader;
	}

	function loadExistingSession () {

		if ($window.sessionStorage.length > 0 &&
			$window.sessionStorage.token) {
			logger.debug('Session exists.');
			logger.debug('Saving window session to session service.');

			userSession.email = $window.sessionStorage.email;
			userSession._id = $window.sessionStorage._id;
			userSession.token = $window.sessionStorage.token;
			userSession.expires = $window.sessionStorage.expires;

		} else {
			logger.info('Session doesn\'t exist');
		}

	}

	// Load existing window session if it exists
	loadExistingSession();

}

angular
	.module('njrt.session')
	.service('njrt.SessionService', ['njrtLog', '$window', 'Restangular', SessionService]);
