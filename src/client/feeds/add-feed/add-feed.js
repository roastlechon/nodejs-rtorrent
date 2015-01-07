'use strict';

function config ($stateProvider) {
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
			isModal: true
		});
}

module.exports = angular
	.module('njrt.feeds.addFeed', [])
	.config(['$stateProvider', config]);

require('./add-feed-controller');