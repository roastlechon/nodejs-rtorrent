var log = require('../log/log');
var feeds = require('../feeds/feeds');

module.exports = angular
	.module('feeds.add', [
		'ui.router',
		log.name,
		feeds.name
	])
	.config(function($stateProvider) {
		$stateProvider.state('home.feeds.add', {
			url: '/add',
			views: {
				'modal@': {
					templateUrl: 'feeds.add/feeds.add.tpl.html',
					controller: 'FeedsAddController as feedsAdd'
				}
			},
			isModal: true
		});
	});

require('./feeds.add-controller');