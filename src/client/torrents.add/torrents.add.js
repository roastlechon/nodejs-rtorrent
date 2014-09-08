var log = require('../log/log');
var torrents = require('../torrents/torrents');

module.exports = angular
	.module('torrents.add', [
		'ui.router',
		log.name,
		torrents.name
	])
	.config(function($stateProvider) {
		$stateProvider.state('home.torrents.add', {
			url: '/add',
			views: {
				'modal@': {
					templateUrl: 'torrents.add/torrents.add.tpl.html',
					controller: 'TorrentsAddController as torrentsAdd'
				}
			},
			isModal: true
		});
	});

require('./torrents.add-controller');