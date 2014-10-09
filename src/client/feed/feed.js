var log = require('../log/log');
var feeds = require('../feeds/feeds');
var torrents = require('../torrents/torrents');

module.exports = angular
	.module('feed', [
		'ui.router',
		log.name,
		feeds.name,
		torrents.name
	])
	.config(function($stateProvider) {
		$stateProvider.state('home.feeds.view', {
			url: '/:id/view',
			views: {
				'home@': {
					templateUrl: 'feed/feed.tpl.html',
					controller: 'FeedCtrl as feedCtrl'
				}
			},
			data: {
				rule: ['isLoggedIn']
			},
			resolve: {
				feed: function (Feeds, $stateParams) {
					return Feeds.getFeed($stateParams.id);
				}
			}
		});
	});

require('./feed-controller');