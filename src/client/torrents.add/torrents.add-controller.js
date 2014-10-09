module.exports = angular
	.module('torrents.add')
	.controller('TorrentsAddCtrl', function(njrtLog, $state, Torrents) {

		var logger = njrtLog.getInstance('torrents.add.TorrentsAddCtrl');

		logger.debug('TorrentsAddCtrl loaded.');

		var vm = this;

		vm.loadTorrent = function(url) {
			Torrents.load(url)
				.then(function(data) {
					logger.debug(data);
					$state.go('home.torrents');
				}, function(err) {
					logger.error(err);
				});
		}

		vm.cancel = function() {
			$state.go('home.torrents');
		}

	});
