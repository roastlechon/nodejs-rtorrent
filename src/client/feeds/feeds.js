var session = require('../session/session');
var log = require('../log/log');

module.exports = angular
	.module('feeds', [
		'ui.router',
		'ct.ui.router.extras',
		session.name,
		log.name
	])
	.config(function($stateProvider) {
		$stateProvider.state('home.feeds', {
			url: 'feeds',
			views: {
				'home@': {
					controller: 'FeedsCtrl as feedsCtrl',
					templateUrl: 'feeds/feeds.tpl.html'
				}
			},
			data: {
				rule: ['isLoggedIn']
			},
			resolve: {
				feeds: function (Feeds) {
					return Feeds.getFeeds();
				}
			}
		});
	});

require('./feeds-factory');
require('./feeds-controller');