module.exports = angular
	.module('authentication')
	.controller('AuthenticationCtrl', function(njrtLog, Authentication, $previousState) {

		var logger = njrtLog.getInstance('authentication.AuthenticationCtrl');

		logger.debug('AuthenticationCtrl loaded.');

		var vm = this;

		vm.Authentication = Authentication;

	});