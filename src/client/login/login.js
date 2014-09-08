var log = require('../log/log');
var authentication = require('../authentication/authentication');

module.exports = angular
	.module('login', [
		log.name,
		authentication.name,
		'ui.router',
		'ct.ui.router.extras'
	])
	.config(function ($stateProvider) {
		$stateProvider.state('login', {
			url: '/login',
			views: {
				'modal@': {
					templateUrl: 'login/login.tpl.html',
					controller: 'LoginController as login'
				}
			},
			isModal: true
		});
	});

require('./login-controller');