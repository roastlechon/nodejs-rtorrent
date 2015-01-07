'use strict';

function SettingsCtrl (njrtLog) {

	var logger = njrtLog.getInstance('njrt.SettingsCtrl');

	logger.debug('njrt.SettingsCtrl loaded.');

	var vm = this;

}

module.exports = angular
	.module('njrt.settings')
	.controller('njrt.SettingsCtrl', ['njrtLog', SettingsCtrl]);