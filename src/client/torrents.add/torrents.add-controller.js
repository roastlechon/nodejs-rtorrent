module.exports = angular
	.module('torrents.add')
	.controller('TorrentsAddController', ['njrtLog', '$previousState', 'Torrents',
		function(njrtLog, $previousState, Torrents) {
			var logger = njrtLog.getInstance('TorrentsAddController');
			logger.debug('TorrentsAddController loaded');

			var vm = this;

			vm.loadTorrent = function(url) {
				Torrents.load({
					'url': url
				}).then(function(data) {
					logger.debug(data);
					$previousState.go('modalInvoker');
				}, function(err) {
					logger.error(err);
				});
			}

			vm.cancel = function() {
				$previousState.go('modalInvoker');
			}

		}
	]);