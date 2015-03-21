var logger = require('winston');
var Q = require('q');
var rtorrent = require('../lib/rtorrent');
var nconf = require('nconf');
var _ = require('lodash');

/**
 * torrents-model.js
 *
 * Model file that contains list of torrents from rtorrent.
 * Torrents stay up to date constantly. On client connection,
 * torrent loop is started. Client emits "torrents" with query
 * object. Server will emit back "torrents" as a result of query.
 * 
 */

var interval;

function startLoop() {
	logger.info('Starting torrent loop.');
	interval = setInterval(function () {
		rtorrent.getTorrents()
			.then(function(data) {
				exports.list = data;
			}, function(err) {
				logger.error(err.message);
			});
	}, nconf.get('app:rtorrentLoopInterval'));
}

function stopLoop() {
	logger.info('Stopping torrent loop.');
	clearInterval(interval);
}

function query(params) {
	var deferred = Q.defer();

	deferred.resolve(exports.list);
	
	return deferred.promise;
}

function all() {
	var deferred = Q.defer();

	deferred.resolve(exports.list);

	return deferred.promise;
}

exports.list = [];
exports.startLoop = startLoop;
exports.stopLoop = stopLoop;
exports.query = query;
exports.all = all;