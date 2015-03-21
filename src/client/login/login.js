function config($stateProvider) {
	$stateProvider.state('login', {
		url: '/login',
		views: {
			'modal@': {
				templateUrl: 'login/login.tpl.html',
				controller: 'njrt.LoginCtrl as loginCtrl'
			}
		},
		isModal: true
	});
}

angular
	.module('njrt.login', [])
	.config(['$stateProvider', config]);
