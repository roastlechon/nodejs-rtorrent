function LoginCtrl(njrtLog, Authentication, SessionService, $state, $previousState) {

	var logger = njrtLog.getInstance('njrt.login');

	logger.debug('LoginCtrl loaded.');

	var vm = this;

	vm.error = '';

	vm.close = function () {
		$state.go('top'); // return to previous state
	};

	vm.login = function () {
		Authentication.login({
			email: vm.email,
			password: vm.password
		}).then(function (data) {

			if (SessionService.destinationState != '') {
				$state.go(SessionService.destinationState);
			} else {
				$state.go('top');
			}

		}, function (err) {
			handleError(err);
			logger.error(err);
		});
	};

	function handleError (err) {
		console.log(err);
		if (err.message === 'Unauthorized') {
			vm.error = 'Username or password is incorrect, please try again.';
		}
	}
}

angular
	.module('njrt.login')
	.controller('njrt.LoginCtrl', ['njrtLog', 'njrt.Authentication', 'njrt.SessionService', '$state', '$previousState', LoginCtrl]);
