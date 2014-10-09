module.exports = angular
	.module('feeds.delete')
	.controller('FeedsDeleteCtrl', function(njrtLog, $state, feed, $modal, Feeds) {

		var logger = njrtLog.getInstance('feeds.delete.FeedsDeleteCtrl');

		logger.debug('FeedsDeleteCtrl loaded.');

		var vm = this;
		
		vm.feed = feed;

		vm.deleteFeed = function (feed) {
			Feeds.deleteFeed(feed)
				.then(function(data) {
					$state.go('home.feeds');
				}, function(err) {
					logger.error(err);
				});
		}

		vm.cancel = function () {
			$state.go('home.feeds');
		}

		
	});