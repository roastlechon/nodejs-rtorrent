'use strict';

function config ($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.when('/settings', '/settings/connection');
	
	$stateProvider
		.state('settings', {
			url: '/settings',
			views: {
				'modal@': {
					templateUrl: 'settings/settings.tpl.html',
					controller: 'njrt.SettingsCtrl as settingsCtrl'
				}
			},
			data: {
				rule: ['isLoggedIn']
			},
			isModal: true,
			modalSize: 'lg'
		})
		.state('settings.connection', {
			url: '/connection',
			templateUrl: 'settings/settings.connection.tpl.html',
			data: {
				rule: ['isLoggedIn']
			},
			isModal: true,
			modalSize: 'lg'
		});

}

module.exports = angular
	.module('njrt.settings', [])
	.config(['$stateProvider', '$urlRouterProvider', config]);

require('./settings-controller');