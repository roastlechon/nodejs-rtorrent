function DownloadSettingsCtrl(njrtLog, downloadSettings, Settings, $previousState, $scope) {

	var logger = njrtLog.getInstance('njrt.settings');

	logger.debug('njrt.DownloadSettingsCtrl loaded.');

	var vm = this;

	vm.downloadSettings = downloadSettings;

	vm.alerts = [];
	vm.closeAlert = function (index) {
		vm.alerts.splice(index, 1);
	};

	vm.cancel = function () {
		$previousState.go('modalInvoker');
	};

	vm.updateDownloadSettings = function (downloadSettings) {
		Settings.updateDownloadSettings(downloadSettings)
			.then(function () {
				vm.alerts.push({
					type: 'success',
					msg: 'Successfully saved download settings.'
				});
				$scope.downloadSettings.$setPristine();
			}, function (err) {
				vm.alerts.push({
					type: 'danger',
					msg: 'Failed to save download settings.'
				});
				logger.error(err);
			});
	};

}

angular
	.module('njrt.settings.downloadSettings')
	.controller('njrt.DownloadSettingsCtrl', ['njrtLog', 'downloadSettings', 'njrt.Settings', '$previousState', '$scope', DownloadSettingsCtrl]);
