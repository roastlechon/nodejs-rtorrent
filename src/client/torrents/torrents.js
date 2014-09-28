var log = require('../log/log');
var socket = require('../socket/socket');
var session = require('../session/session');

module.exports = angular
	.module('torrents', [
		'ui.router',
		'restangular',
		log.name,
		socket.name,
		session.name
	])
	.config(function($stateProvider) {
		$stateProvider.state('home.torrents', {
			url: 'torrents',
			views: {
				'home@': {
					controller: 'TorrentsCtrl as torrentsCtrl',
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