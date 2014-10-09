module.exports = angular
	.module('feed')
	.controller('FeedCtrl', function(njrtLog, $state, $scope, feed, Torrents) {

		var logger = njrtLog.getInstance('feed.FeedCtrl');

		logger.debug('FeedCtrl loaded.');

		var vm = this;

		vm.feed = feed;

		vm.loadTorrent = function (url) {
			Torrents.load(url);
		}

	});