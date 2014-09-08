module.exports = angular
	.module('feed')
	.controller('FeedCtrl', function(njrtLog, $state, $scope, feed, Torrents) {
		var logger = njrtLog.getInstance('feed');

		logger.debug('FeedCtrl loaded');

		var vm = this;

		vm.feed = feed;

		vm.loadTorrent = function (torrent) {
			logger.info("Loading torrent");
			Torrents.load({
				"url": torrent.url
			}).then(function(data) {
				logger.debug(data);
			}, function(err) {
				logger.error(err);
			});
		}

	});