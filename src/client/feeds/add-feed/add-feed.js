function resolve(Settings) {
	return Settings.getDownloadSettings();
}

function config($stateProvider) {
	$stateProvider
		.state('addFeed', {
			url: '/add-feed',
			views: {
				'modal@': {
					templateUrl: 'feeds/add-feed/add-feed.tpl.html',
					controller: 'njrt.AddFeedCtrl as feedsAddCtrl'
				}
			},
			data: {
				rule: ['isLoggedIn']
			},
			resolve: {
				downloadSettings: ['njrt.Settings', resolve]
			},
			isModal: true
		});
}

angular
	.module('njrt.feeds.addFeed', [])
	.config(['$stateProvider', config]);
