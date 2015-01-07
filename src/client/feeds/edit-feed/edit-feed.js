'use strict';

function resolve (Feeds, $stateParams) {
	return Feeds.getFeed($stateParams.id);
}

function config ($stateProvider) {
	$stateProvider.state('editFeed', {
		url: '/edit-feed/:id',
		views: {
			'modal@': {
				templateUrl: 'feeds/edit-feed/edit-feed.tpl.html',
				controller: 'njrt.EditFeedCtrl as feedsEditCtrl'
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

module.exports = angular
	.module('njrt.feeds.editFeed', [])
	.config(['$stateProvider', config]);

require('./edit-feed-controller');