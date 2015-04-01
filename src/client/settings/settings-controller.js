'use strict';

function SettingsCtrl (njrtLog, $state) {

	var logger = njrtLog.getInstance('njrt.SettingsCtrl');

	logger.debug('njrt.SettingsCtrl loaded.');

	var vm = this;

	$state.go('settings.download');

}

module.exports = angular
	.module('njrt.settings')
	.controller('njrt.SettingsCtrl', ['njrtLog', '$state', SettingsCtrl]);