var log = require('../log/log');
var feeds = require('../feeds/feeds');

module.exports = angular
	.module('feeds.delete', [
		'ui.router',
		log.name,
		feeds.name
	])
	.config(function($stateProvider) {
		$stateProvider.state('home.feeds.delete', {
			url: '/:id/delete',
			views: {
				'modal@': {
					templateUrl: 'feeds.delete/feeds.delete.tpl.html',
					controller: 'FeedsDeleteCtrl as feedsDeleteCtrl'
				}
			},
			isModal: true,
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

require('./feeds.delete-controller');