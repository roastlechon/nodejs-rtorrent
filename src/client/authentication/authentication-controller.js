function AuthenticationCtrl(njrtLog, Authentication) {

	var logger = njrtLog.getInstance('njrt.authentication');

	logger.debug('AuthenticationCtrl loaded.');

	var vm = this;

	vm.Authentication = Authentication;

}

angular
	.module('njrt.authentication')
	.controller('njrt.AuthenticationCtrl', ['njrtLog', 'njrt.Authentication', AuthenticationCtrl]);
