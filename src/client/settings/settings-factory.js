function Settings(njrtLog, Restangular, $q) {

	var logger = njrtLog.getInstance('njrt.settings');

	logger.debug('Settings loaded.');

	var Settings = {};

	Settings.getConnectionSettings = function () {
		return Restangular.one('settings/connection').get();
	};

	Settings.updateConnectionSettings = function (connectionSettings) {
		return connectionSettings.put();
	};

	Settings.getDownloadSettings = function () {
		return Restangular.one('settings/download').get();
	};

	Settings.updateDownloadSettings = function (downloadSettings) {
		return downloadSettings.put();
	};

	return Settings;
}

angular
	.module('njrt.settings')
	.factory('njrt.Settings', ['njrtLog', 'Restangular', '$q', Settings]);
