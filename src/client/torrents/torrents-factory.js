function Torrents(njrtLog, Restangular, Socket, Notification, $state, SessionService, $q, $upload, $interval) {

	var logger = njrtLog.getInstance('njrt.torrents');

	logger.debug('Torrents loaded.');

	var Torrents = {};

	Torrents.torrents = [];

	Torrents.selectedTorrents = [];

  Torrents.cleanup = [];
  Torrents.refreshRows = false;

  Torrents.totalSize = 0;

	Socket.on('connecting', function() {
		logger.debug('Connecting to socket.');
	});

  Socket.on('connection', function () {
    logger.debug('Connection established.');
  });

	Socket.on('disconnect', function () {
		logger.debug('Disconnected from socket.');
    Notification.add('danger', 'Disconnected from nodejs-rtorrent socket. <a href="javascript: void(0);" ng-click="notificationCtrl.reconnectSocket()">Click to reconnect.</a>', true);
	});

	Socket.on('connect_failed', function() {
		logger.error('Connection to socket failed');
		Notification.add('danger', 'Failed to connect to server via web sockets');
	});

	Socket.on('error', function(err) {
		logger.error(err);
		if (err === 'Authentication token does not match.' || err === 'Authentication token has expired.') {
			Notification.add('danger', 'Authentication token does not match or has expired. Please login.');

			// Clear session
			SessionService.clearSession();

			$state.go('login');
		}
	});

	Torrents.getTorrents = function (query) {
		var deferred = $q.defer();

		Socket.emit('torrentsQuery', query, function (err, data) {
			if (err) {
				deferred.reject(err);
			}

			deferred.resolve(data);
		});

		return deferred.promise;
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
				.post('delete-data', {})
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
		if (torrent.file instanceof File) {
			logger.debug('Loading torrent from file', torrent.file.name);

			return $upload.upload({
				url: '/torrents/load',
				method: 'POST',
				headers: {
					'Authorization': SessionService.getAuthorizationHeader()
				},
				data: {
					path: torrent.path
				},
				file: torrent.file
			}).then(function (data) {
        Torrents.refreshRows = true;
				return Notification.add('success', 'Torrent loaded.');
			}, function (err) {
				return Notification.add('danger', 'Torrent failed to load.');
			});
		}

		logger.debug('Loading torrent from url', torrent.url);
		return Restangular
			.all('torrents')
			.customPOST(torrent, 'load')
			.then(function (data) {
        Torrents.refreshRows = true;
				return Notification.add('success', 'Torrent loaded.');
			}, function (err) {
				logger.error(err.data);
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

angular
  .module('njrt.torrents')
  .factory('njrt.Torrents', ['njrtLog', 'Restangular', 'Socket', 'njrt.Notification', '$state', 'njrt.SessionService', '$q', '$upload', '$interval', Torrents]);
