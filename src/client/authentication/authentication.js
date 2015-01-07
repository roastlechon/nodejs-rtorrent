'use strict';

function run ($rootScope, SessionService, $state, $previousState, njrtLog, Restangular) {

	var logger = njrtLog.getInstance('njrt.authentication');

	logger.debug('njrt.authentication module loaded.');

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

		if (!toState.data) {
			logger.debug('State has no data, returning early');
			return;
		}

		if (toState.data.rule && toState.data.rule.indexOf('isLoggedIn') !== -1) {
			logger.debug(toState.name, 'state has rule: isLoggedIn');
			if (!SessionService.isCurrentSessionValid()) {
				// Save to state to session service destination state
				// so that we can track where the user wants to go
				// and redirect to that after user is finished logging in
				SessionService.destinationState = toState.name;
				$state.go('login');
				event.preventDefault();
			}
		}
	});

	Restangular.setErrorInterceptor(
		function (res) {
			if (res.status == 401) {
				logger.error(res.status, res.statusText, ':', res.data);
				$state.go('login');
				return false; // stop the promise chain
			} else if (res.status == 404) {
				logger.error(res.status, res.statusText, ':', res.data);
				return false; // stop the promise chain
			} 
			return true;
		});

	Restangular.setRestangularFields({
		id: "_id"
	});

	Restangular.setDefaultHeaders({
		Authorization: SessionService.getAuthorizationHeader()
	});

}

module.exports = angular
	.module('njrt.authentication', [])
	.run(['$rootScope', 'njrt.SessionService', '$state', '$previousState', 'njrtLog', 'Restangular', run]);

require('./authentication-factory');
require('./authentication-controller');