'use strict';

var connectionSettings = require('./connection-settings/connection-settings');
var downloadSettings = require('./download-settings/download-settings');

function config ($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.when('/settings', '/settings/download');
	
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
		});
}

module.exports = angular
	.module('njrt.settings', [
		connectionSettings.name,
		downloadSettings.name
	])
	.config(['$stateProvider', '$urlRouterProvider', config]);

require('./settings-factory');
require('./settings-controller');