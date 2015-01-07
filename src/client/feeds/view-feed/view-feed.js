'use strict';

function resolve (Feeds, $stateParams) {
	return Feeds.getFeed($stateParams.id);
}
	
function config ($stateProvider) {
	$stateProvider.state('top.feeds.view', {
		url: '/:id/view',
		views: {
			'content@top': {
				templateUrl: 'feeds/view-feed/view-feed.tpl.html',
				controller: 'njrt.ViewFeedCtrl as feedCtrl'
			}
		},
		data: {
			rule: ['isLoggedIn']
		},
		resolve: {
			feed: ['njrt.Feeds', '$stateParams', resolve]
		}
	});
}

module.exports = angular
	.module('njrt.feeds.viewFeed', [])
	.config(['$stateProvider', config]);

require('./view-feed-controller');