'use strict';

function resolve (Settings) {
	return Settings.getDownloadSettings();
}

function config ($stateProvider) {
	
	$stateProvider
		.state('settings.download', {
			url: '/download',
			templateUrl: 'settings/download-settings/download-settings.tpl.html',
			controller: 'njrt.DownloadSettingsCtrl as downloadSettingsCtrl',
			data: {
				rule: ['isLoggedIn']
			},
			isModal: true,
			modalSize: 'lg',
			resolve: {
				downloadSettings: ['njrt.Settings', resolve]
			}
		});

}

module.exports = angular
	.module('njrt.settings.downloadSettings', [])
	.config(['$stateProvider', config]);

require('./download-settings-controller');