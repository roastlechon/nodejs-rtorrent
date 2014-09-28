module.exports = angular
	.module('torrents')
	.factory('Torrents', function (njrtLog, Restangular, Socket, Notification, $state, SessionService) {

		var logger = njrtLog.getInstance('torrents.Torrents');

		logger.debug('Torrents loaded.');

		var Torrents = {};

		Torrents.torrents = [];

		Socket.on('connect', function() {
			logger.debug('Connected to socket.');
		});

		Socket.on('connecting', function() {
			logger.debug('Connecting to socket.');
		});

		Socket.on('connect_failed', function() {
			logger.error('Connection to socket failed');
			Notification.add('danger', 'Failed to connect to server via web sockets');
		});

		Socket.on('error', function(err) {
			if (err === 'handshake unauthorized') {
				Notification.add('danger', 'Handshake unauthorized. Please login.');
				
				// Clear session
				SessionService.clearSession();

				// Redirect to login
				$state.go('login');
			}
			logger.error(err);
		});

		Socket.on('torrents', function(data) {
			Torrents.torrents = data;
		});

		Torrents.getTorrents = function () {
			logger.debug('Getting torrents');

			// Initial REST call to get torrents on resolve.
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
				.post('start', {})
				.then(function () {
					return Notification.add('success', 'Torrent started.');
				}, function () {
					return Notification.add('danger', 'Torrent failed to start.');
				});
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
				.post('pause', {})
				.then(function () {
					return Notification.add('success', 'Torrent paused.');
				}, function () {
					return Notification.add('danger', 'Torrent failed to pause.');
				});
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
				.post('stop', {})
				.then(function () {
					return Notification.add('success', 'Torrent stopped.');
				}, function () {
					return Notification.add('danger', 'Torrent failed to stop.');
				});
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
				.post('remove', {})
				.then(function () {
					return Notification.add('success', 'Torrent removed.');
				}, function () {
					return Notification.add('danger', 'Torrent could not be removed.');
				});
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
				}, 'load')
				.then(function () {
					return Notification.add('success', 'Torrent loaded.');
				}, function () {
					return Notification.add('danger', 'Torrent failed to load.');
				});
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
				})
				.then(function () {
					return Notification.add('success', 'Torrent throttle channel set.');
				}, function () {
					return Notification.add('danger', 'Torrent could not be throttled.');
				});
		}

		return Torrents;
	});