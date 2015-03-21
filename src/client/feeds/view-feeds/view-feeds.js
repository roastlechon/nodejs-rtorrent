function resolve (Feeds) {
	return Feeds.getFeeds();
}

function config ($stateProvider) {
	$stateProvider
		.state('top.feeds', {
			url: 'feeds',
			views: {
				'content@top': {
					controller: 'njrt.ViewFeedsCtrl as feedsCtrl',
					templateUrl: 'feeds/view-feeds/view-feeds.tpl.html'
				}
			},
			data: {
				rule: ['isLoggedIn']
			},
			resolve: {
				feeds: ['njrt.Feeds', resolve]
			}
		});
}

angular
	.module('njrt.feeds.viewFeeds', [])
	.config(['$stateProvider', config]);
