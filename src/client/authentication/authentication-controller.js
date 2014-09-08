module.exports = angular
	.module('authentication')
	.controller('AuthenticationController', function(njrtLog, Authentication, $previousState) {

		var logger = njrtLog.getInstance('AuthenticationController');

		logger.debug('AuthenticationController loaded');

		var vm = this;

		vm.Authentication = Authentication;

	});