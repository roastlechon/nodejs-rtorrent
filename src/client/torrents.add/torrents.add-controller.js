module.exports = angular
	.module('torrents.add')
	.controller('TorrentsAddCtrl', function(njrtLog, $previousState, Torrents) {

		var logger = njrtLog.getInstance('torrents.add.TorrentsAddCtrl');

		logger.debug('TorrentsAddCtrl loaded.');

		var vm = this;

		vm.loadTorrent = function(url) {
			Torrents.loadTorrent(url).then(function(data) {
				logger.debug(data);
				$previousState.go('modalInvoker');
			}, function(err) {
				logger.error(err);
			});
		}

		vm.cancel = function() {
			$previousState.go('modalInvoker');
		}

	});