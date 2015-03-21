function resolve(Feeds, $stateParams) {
	return Feeds.getFeed($stateParams.id);
}

function config($stateProvider) {
	$stateProvider.state('deleteFeed', {
		url: '/delete-feed/:id',
		views: {
			'modal@': {
				templateUrl: 'feeds/delete-feed/delete-feed.tpl.html',
				controller: 'njrt.DeleteFeedCtrl as feedsDeleteCtrl'
			}
		},
		isModal: true,
		data: {
			rule: ['isLoggedIn']
		},
		resolve: {
			feed: ['njrt.Feeds', '$stateParams', resolve]
		}
	});
}

angular
	.module('njrt.feeds.deleteFeed', [])
	.config(['$stateProvider', config]);
