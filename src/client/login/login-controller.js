module.exports = angular
	.module('login')
	.controller('LoginCtrl', function(njrtLog, Authentication, $state) {

		var logger = njrtLog.getInstance('login.LoginCtrl');

		logger.debug('LoginCtrl loaded.');

		var vm = this;

		vm.close = function() {
			$state.go('home'); // return to previous state
		};


		vm.login = function() {
			Authentication.login({
				email: vm.email,
				password: vm.password
			}).then(function(data) {
				logger.info(data);
				$state.go('home');
			}, function(err) {
				logger.error(err);
			});
		};
	});