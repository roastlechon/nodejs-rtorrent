var mongoose = require('mongoose');
var logger = require('winston');
var Q = require('q');
var rtorrent = require('../lib/rtorrent');

var connection = {};
var download = {};

function buildResults (promiseArray) {
	return Q.all(promiseArray)
		.then(function (results) {

			var settingResults = {};

			results.forEach(function (result) {
				// get attributes from result
				for (var attr in result) {
					settingResults[attr] = result[attr];
				}

			});

			return settingResults;
		}, function (err) {
			logger.error('Error occurred while waiting for promises to resolve.');
			console.log(err);
			throw err;
		});
}

connection.all = function () {
	var connectionSettingsPromises = [];

	connectionSettingsPromises.push(rtorrent.getPortOpen());
	connectionSettingsPromises.push(rtorrent.getPortRandom());
	connectionSettingsPromises.push(rtorrent.getPortRange());
	connectionSettingsPromises.push(rtorrent.getUploadSlotsGlobal());
	connectionSettingsPromises.push(rtorrent.getDownloadSlotsGlobal());
	connectionSettingsPromises.push(rtorrent.getGlobalMaximumUploadRate());
	connectionSettingsPromises.push(rtorrent.getGlobalMaximumDownloadRate());

	return buildResults(connectionSettingsPromises);
};

connection.edit = function (connectionSettings) {
	var connectionSettingsPromises = [];

	connectionSettingsPromises.push(rtorrent.setPortOpen(connectionSettings.port_open));
	connectionSettingsPromises.push(rtorrent.setPortRandom(connectionSettings.port_random));
	connectionSettingsPromises.push(rtorrent.setPortRange(connectionSettings.port_range));
	connectionSettingsPromises.push(rtorrent.setUploadSlotsGlobal(connectionSettings.max_uploads_global));
	connectionSettingsPromises.push(rtorrent.setDownloadSlotsGlobal(connectionSettings.max_downloads_global));
	connectionSettingsPromises.push(rtorrent.setGlobalMaximumUploadRate(connectionSettings.global_max_upload_rate));
	connectionSettingsPromises.push(rtorrent.setGlobalMaximumDownloadRate(connectionSettings.global_max_download_rate));

	return buildResults(connectionSettingsPromises);
};

download.all = function () {
	var downloadSettingPromises = [];

	downloadSettingPromises.push(rtorrent.getUploadSlots());
	downloadSettingPromises.push(rtorrent.getMaxNumberPeers());
	downloadSettingPromises.push(rtorrent.getMinNumberPeers());
	downloadSettingPromises.push(rtorrent.getMaxNumberSeeds());
	downloadSettingPromises.push(rtorrent.getMinNumberSeeds());
	downloadSettingPromises.push(rtorrent.getDirectory());

	return buildResults(downloadSettingPromises);
};

download.edit = function (downloadSettings) {
	var downloadSettingPromises = [];

	downloadSettingPromises.push(rtorrent.setUploadSlots(downloadSettings.max_uploads));
	downloadSettingPromises.push(rtorrent.setMaxNumberPeers(downloadSettings.max_peers));
	downloadSettingPromises.push(rtorrent.setMinNumberPeers(downloadSettings.min_peers));
	downloadSettingPromises.push(rtorrent.setMaxNumberSeeds(downloadSettings.max_seeds));
	downloadSettingPromises.push(rtorrent.setMinNumberSeeds(downloadSettings.min_seeds));
	downloadSettingPromises.push(rtorrent.setDirectory(downloadSettings.download_directory));

	return buildResults(downloadSettingPromises);
};

exports.download = download;
exports.connection = connection;