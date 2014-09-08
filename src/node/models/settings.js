var mongoose = require("mongoose");
var logger = require("winston");
var Q = require("q");
var rtorrent = require("../lib/rtorrent");

var settings = module.exports = {};

var listeningPort = settings.listeningPort = {};

var bandwidthLimiting = settings.bandwidthLimiting = {};

bandwidthLimiting.getGlobalMaximumUploadRate = function() {
	return rtorrent.getGlobalMaximumUploadRate();
}

bandwidthLimiting.setGlobalMaximumUploadRate = function(value) {
	return rtorrent.setGlobalMaximumUploadRate(value);
}

bandwidthLimiting.getGlobalMaximumDownloadRate = function() {
	return rtorrent.getGlobalMaximumDownloadRate();
}

bandwidthLimiting.setGlobalMaximumDownloadRate = function(value) {
	return rtorrent.setGlobalMaximumDownloadRate(value);
}