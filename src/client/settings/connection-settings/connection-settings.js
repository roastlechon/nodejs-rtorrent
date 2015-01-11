'use strict';

function resolve (Settings) {
	return Settings.getConnectionSettings();
}

function config ($stateProvider) {
	
	$stateProvider
		.state('settings.connection', {
			url: '/connection',
			templateUrl: 'settings/connection-settings/connection-settings.tpl.html',
			controller: 'njrt.ConnectionSettingsCtrl as connectionSettingsCtrl',
			data: {
				rule: ['isLoggedIn']
			},
			isModal: true,
			modalSize: 'lg',
			resolve: {
				connectionSettings: ['njrt.Settings', resolve]
			}
		});

}

module.exports = angular
	.module('njrt.settings.connectionSettings', [])
	.config(['$stateProvider', config]);

require('./connection-settings-controller');