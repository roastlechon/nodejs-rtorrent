function DeleteFeedCtrl(njrtLog, $state, $previousState, feed, $modal, Feeds) {

	var logger = njrtLog.getInstance('njrt.feeds');

	logger.debug('DeleteFeedCtrl loaded.');

	var vm = this;

	vm.feed = feed;

	vm.deleteFeed = function (feed) {
		Feeds.deleteFeed(feed)
			.then(function (data) {
				$previousState.go('modalInvoker');
			}, function (err) {
				logger.error(err);
			});
	};

	vm.cancel = function () {
		$previousState.go('modalInvoker');
	};

}

angular
	.module('njrt.feeds.deleteFeed')
	.controller('njrt.DeleteFeedCtrl', ['njrtLog', '$state', '$previousState', 'feed', '$modal', 'njrt.Feeds', DeleteFeedCtrl]);
