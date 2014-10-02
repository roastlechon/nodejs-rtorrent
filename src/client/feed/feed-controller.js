module.exports = angular
	.module('feed')
	.controller('FeedCtrl', function(njrtLog, $state, $scope, feed, Torrents) {

		var logger = njrtLog.getInstance('feed.FeedCtrl');

		logger.debug('FeedCtrl loaded.');

		var vm = this;

		vm.feed = feed;

		vm.loadTorrent = function (url) {
			logger.debug('Loading torrent');
			Torrents.load(url)
			.then(function(data) {
				logger.debug(data);
			}, function(err) {
				logger.error(err);
			});
		}

	});