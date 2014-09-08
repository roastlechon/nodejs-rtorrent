var log = require('../log/log');
var session = require('../session/session');

module.exports = angular
	.module('authentication', [
		session.name,
		log.name
	])
	.run(function($rootScope, SessionService, $state, njrtLog, Restangular) {
		var logger = njrtLog.getInstance('authentication');

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

			if (!toState.data) {
				logger.debug('State has no data, returning early');
				return;
			}

			if (toState.data.rule && toState.data.rule.indexOf('isLoggedIn') !== -1) {
				logger.debug(toState.name, 'state has rule: isLoggedIn');
				if (!SessionService.isCurrentSessionValid()) {
					$state.go('login');
					event.preventDefault();
				}
			}
		});

		Restangular.setErrorInterceptor(
			function(res) {
				if (res.status == 401) {
					logger.error(res.status, res.statusText, ':', res.data);
					$state.go('login');
				} else if (res.status == 404) {
					logger.error(res.status, res.statusText, ':', res.data);
				} else {
					logger.error(res.status, res.statusText, ':', res.data);
				}
				return false; // stop the promise chain
			});

		Restangular.setRestangularFields({
			id: "_id"
		});

		Restangular.setDefaultHeaders({
			Authorization: SessionService.getAuthorizationHeader()
		});

	});

require('./authentication-factory');
require('./authentication-controller');