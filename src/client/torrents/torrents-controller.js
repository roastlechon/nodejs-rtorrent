module.exports = angular
	.module('torrents')
	.controller('TorrentsController', function(njrtLog, $state, Torrents, Socket) {
		var logger = njrtLog.getInstance('TorrentsController');
		logger.debug('TorrentsController loaded');

		var vm = this;

		vm.t = Torrents;

		vm.predicate = 'name';
		vm.reverse = false;
		vm.status = '';

		Socket.connect();

		Socket.on('connect', function() {
			logger.debug('Connected to socket.');
		});

		Socket.on('connecting', function() {
			logger.debug('Connecting to socket.');
		});

		Socket.on('connect_failed', function() {
			logger.error('Connection to socket failed');
		});

		Socket.on('error', function(err) {
			if (err === 'handshake unauthorized') {
				$state.go('login');
			}
			logger.error(err);
		});

		Socket.on('torrents', function(data) {
			vm.torrents = data;
		});
	});