module.exports = angular
	.module('njrt.torrents')
	.factory('njrt.Torrents', ['njrtLog', 'Restangular', 'Socket', 'njrt.Notification', '$state', 'njrt.SessionService', '$q', Torrents]);

function Torrents (njrtLog, Restangular, Socket, Notification, $state, SessionService, $q) {

	var logger = njrtLog.getInstance('njrt.torrents');

	logger.debug('Torrents loaded.');

	var Torrents = {};

	Torrents.torrents = [];

	Torrents.selectedTorrents = [];

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
	};

	Torrents.getTorrent = function (hash) {
		// Check if hash is instance of array.
		// If hash is instance of array, 
		if (!(hash instanceof Array)) {
			hash = [hash];
		}

		return _.filter(Torrents.torrents, function (torrent) {
			for (var i = hash.length - 1; i >= 0; i--) {
				if (hash[i] == torrent.hash) {
					return true;
					break;
				}
			};
		});
	};

	Torrents.isTorrentSelected = function (hash) {
		var index = Torrents.selectedTorrents.indexOf(hash);
		if (index > -1) {
			return true;
		}

		return false;
	};

	Torrents.selectTorrent = function (hash) {
		var index = Torrents.selectedTorrents.indexOf(hash);
		
		if (index === -1) {
			Torrents.selectedTorrents.push(hash);
			console.log('Selected torrents:', Torrents.selectedTorrents);
			return;
		} 

		Torrents.selectedTorrents.splice(index, 1);
		console.log('Selected torrents:', Torrents.selectedTorrents);
	};

	/**
	 * Start a torent given a specified torrent hash.
	 * @param  {String} hash Hash of the torrent.
	 * @return {Promise}      Promise with success string.
	 */
	Torrents.start = function (hash) {
		// Check if hash is instance of array.
		// If hash is instance of array, 
		if (!(hash instanceof Array)) {
			hash = [hash];
		}

		var promises = [];

		angular.forEach(hash, function (h) {
			promises.push(Restangular
				.one('torrents', h)
				.post('start', {})
			);
		});

		logger.debug('Starting torrent(s) from hashes', hash);
		return $q.all(promises)
			.then(function () {
				// Remove selected torrents from selectedTorrents array.
				Torrents.selectedTorrents = [];

				return Notification.add('success', 'Torrent(s) started.');
			}, function () {
				return Notification.add('danger', 'Torrent(s) failed to start.');
			});
	};

	/**
	 * Pause a torrent given a specified torrent hash.
	 * @param  {String} hash Hash of the torrent.
	 * @return {Promise}      Promise with success string.
	 */
	Torrents.pause = function (hash) {
		// Check if hash is instance of array.
		// If hash is instance of array, 
		if (!(hash instanceof Array)) {
			hash = [hash];
		}

		var promises = [];

		angular.forEach(hash, function (h) {
			promises.push(Restangular
				.one('torrents', h)
				.post('pause', {})
			);
		});

		logger.debug('Pausing torrent(s) from hash', hash);
		return $q.all(promises)
			.then(function () {
				// Remove selected torrents from selectedTorrents array.
				Torrents.selectedTorrents = [];

				return Notification.add('success', 'Torrent(s) paused.');
			}, function () {
				return Notification.add('danger', 'Torrent(s) failed to pause.');
			});
	};

	/**
	 * Stop a torrent given a specified torrent hash.
	 * @param  {String} hash Hash of the torrent
	 * @return {Promise}      Promise with success string.
	 */
	Torrents.stop = function (hash) {
		// Check if hash is instance of array.
		// If hash is instance of array, 
		if (!(hash instanceof Array)) {
			hash = [hash];
		}

		var promises = [];

		angular.forEach(hash, function (h) {
			promises.push(Restangular
				.one('torrents', h)
				.post('stop', {})
			);
		});

		logger.debug('Stopping torrent(s) from hash', hash);
		return $q.all(promises)
			.then(function () {
				// Remove selected torrents from selectedTorrents array.
				Torrents.selectedTorrents = [];

				return Notification.add('success', 'Torrent(s) stopped.');
			}, function () {
				return Notification.add('danger', 'Torrent(s) failed to stop.');
			});
	};

	/**
	 * Remove a torrent given a specified torrent hash.
	 * @param  {String} hash Hash of the torrent
	 * @return {Promise}      Promise with success string.
	 */
	Torrents.remove = function (hash) {
		// Check if hash is instance of array.
		// If hash is instance of array, 
		if (!(hash instanceof Array)) {
			hash = [hash];
		}

		var promises = [];

		angular.forEach(hash, function (h) {
			promises.push(Restangular
				.one('torrents', h)
				.post('remove', {})
			);
		});

		logger.debug('Removing torrent(s) from hash', hash);
		return $q.all(promises)
			.then(function () {
				// Remove selected torrents from selectedTorrents array.
				Torrents.selectedTorrents = [];

				return Notification.add('success', 'Torrent(s) removed.');
			}, function () {
				return Notification.add('danger', 'Torrent(s) could not be removed.');
			});
	};

	/**
	 * Delete torrent data given a specified torrent hash.
	 * @param  {String} hash Hash of the torrent
	 * @return {Promise}      Promise with success string.
	 */
	Torrents.deleteData = function (hash) {
		// Check if hash is instance of array.
		// If hash is instance of array, 
		if (!(hash instanceof Array)) {
			hash = [hash];
		}

		var promises = [];

		angular.forEach(hash, function (h) {
			promises.push(Restangular
				.one('torrents', h)
				.post('delete_data', {})
			);
		});

		logger.debug('Deleting torrent(s) data from hash', hash);
		return $q.all(promises)
			.then(function () {
				// Remove selected torrents from selectedTorrents array.
				Torrents.selectedTorrents = [];

				return Notification.add('success', 'Torrent(s) data deleted.');
			}, function () {
				return Notification.add('danger', 'Torrent(s) data could not be deleted.');
			});
	};

	/**
	 * Load a torrent given a url string of the torrent file or magnet link.
	 * @param  {String} url  Url of the torrent file or magnet link.
	 * @return {Promise}     Promise with success string.
	 */
	Torrents.load = function (torrent) {
		logger.debug('Loading torrent from url', torrent.url);
		return Restangular
			.all('torrents')
			.customPOST({
				'url': torrent.url,
				'path': torrent.path
			}, 'load')
			.then(function () {
				return Notification.add('success', 'Torrent loaded.');
			}, function () {
				return Notification.add('danger', 'Torrent failed to load.');
			});
	};

	/**
	 * Set the throttle channel for the specified torrent hash.
	 * @param {String} hash    Hash of the torrent.
	 * @param {String} channel Channel name (specified by the server).
	 * @return {Promise}	Promise with success string.
	 */
	Torrents.setChannel = function (hash, channel) {
		// Check if hash is instance of array.
		// If hash is instance of array, 
		if (!(hash instanceof Array)) {
			hash = [hash];
		}

		var promises = [];

		angular.forEach(hash, function (h) {
			promises.push(Restangular
				.one('torrents', hash)
				.post('channel', {
					'channel': channel
				})
			);
		});

		logger.debug('Setting channel for hash(s)', hash, 'with channel', channel);
		return $q.all(promises)
			.then(function () {
				// Remove selected torrents from selectedTorrents array.
				Torrents.selectedTorrents = [];
				
				return Notification.add('success', 'Torrent(s) throttle channel(s) set.');
			}, function () {
				return Notification.add('danger', 'Torrent(s) could not be throttled.');
			});
	};

	return Torrents;
}