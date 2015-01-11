'use strict';

function ConnectionSettingsCtrl (njrtLog, connectionSettings, Settings, $previousState, $scope, Notification) {

	var logger = njrtLog.getInstance('njrt.settings');

	logger.debug('njrt.ConnectionSettingsCtrl loaded.');

	var vm = this;

	vm.connectionSettings = connectionSettings;

	vm.alerts = [];
	vm.closeAlert = function (index) {
		vm.alerts.splice(index, 1);
	};

	vm.cancel = function () {
		$previousState.go('modalInvoker');
	};

	vm.updateConnectionSettings = function (connectionSettings) {
		Settings.updateConnectionSettings(connectionSettings)
			.then(function () {
				vm.alerts.push({
					type: 'success',
					msg: 'Successfully saved connection settings.'
				});
				$scope.connectionSettings.$setPristine();
			}, function (err) {
				vm.alerts.push({
					type: 'danger',
					msg: 'Failed to save connection settings.'
				});
				logger.error(err);
			});
	};

}

module.exports = angular
	.module('njrt.settings.connectionSettings')
	.controller('njrt.ConnectionSettingsCtrl', ['njrtLog', 'connectionSettings', 'njrt.Settings', '$previousState', '$scope', 'njrt.Notification', ConnectionSettingsCtrl]);