module.exports = angular
	.module('torrents')
	.factory('Torrents', function (njrtLog, Restangular, Socket) {

		var logger = njrtLog.getInstance('torrents.Torrents');

		logger.debug('Torrents loaded.');

		var Torrents = {};

		Torrents.torrents = [];

		Torrents.getTorrents = function () {
			logger.debug('Getting torrents');
		}

		/**
		 * Start a torent given a specified torrent hash.
		 * @param  {String} hash Hash of the torrent.
		 * @return {Promise}      Promise with success string.
		 */
		Torrents.start = function (hash) {
			logger.debug('Starting torrent from hash', hash);
			return Restangular
				.one('torrents', hash)
				.post('start', {});
		}

		/**
		 * Pause a torrent given a specified torrent hash.
		 * @param  {String} hash Hash of the torrent.
		 * @return {Promise}      Promise with success string.
		 */
		Torrents.pause = function (hash) {
			logger.debug('Pausing torrent from hash', hash);
			return Restangular
				.one('torrents', hash)
				.post('pause', {});
		}

		/**
		 * Stop a torrent given a specified torrent hash.
		 * @param  {String} hash Hash of the torrent
		 * @return {Promise}      Promise with success string.
		 */
		Torrents.stop = function (hash) {
			logger.debug('Stopping torrent from hash', hash);
			return Restangular
				.one('torrents', hash)
				.post('stop', {});
		}

		/**
		 * Remove a torrent given a specified torrent hash.
		 * @param  {String} hash Hash of the torrent
		 * @return {Promise}      Promise with success string.
		 */
		Torrents.remove = function (hash) {
			logger.debug('Removing torrent from hash', hash);
			return Restangular
				.one('torrents', hash)
				.post('remove', {});	
		}

		/**
		 * Load a torrent given a url string of the torrent file or magnet link.
		 * @param  {String} url  Url of the torrent file or magnet link.
		 * @return {Promise}     Promise with success string.
		 */
		Torrents.load = function (url) {
			logger.debug('Loading torrent from url', url);
			return Restangular
				.all('torrents')
				.customPOST({
					'url': url
				}, 'load');
		}

		/**
		 * Set the throttle channel for the specified torrent hash.
		 * @param {String} hash    Hash of the torrent.
		 * @param {String} channel Channel name (specified by the server).
		 * @return {Promise}	Promise with success string.
		 */
		Torrents.setChannel = function (hash, channel) {
			logger.debug('Setting channel for hash', hash, 'and channel', channel);
			return Restangular
				.one('torrents', hash)
				.post('channel', {
					'channel': channel
				});
		}

		return Torrents;
	});