'use strict';

function config ($stateProvider) {
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

module.exports = angular
	.module('njrt.login', [])
	.config(['$stateProvider', config]);
	
require('./login-controller');