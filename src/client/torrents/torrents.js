var socket = require('../socket/socket');
var session = require('../session/session');

module.exports = angular
	.module('torrents', [
		'ui.router',
		'restangular',
		socket.name,
		session.name
	])
	.config(function($stateProvider) {
		$stateProvider.state('home.torrents', {
			url: 'torrents',
			views: {
				'home@': {
					controller: 'TorrentsController as torrents',
					templateUrl: 'torrents/torrents.tpl.html'
				}
			},
			data: {
				rule: ['isLoggedIn']
			}
		});
	});

	require('./torrents-factory');
	require('./torrents-controller');