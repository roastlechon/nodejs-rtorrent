module.exports = angular
	.module('njrt.torrents.addTorrent', [])
	.config(['$stateProvider', config]);

function config ($stateProvider) {
	$stateProvider.state('addTorrent', {
		url: '/addTorrent',
		views: {
			'modal@': {
				templateUrl: 'torrents/add-torrent/add-torrent.tpl.html',
				controller: 'njrt.AddTorrentCtrl as torrentsAddCtrl'
			}
		},
		data: {
			rule: ['isLoggedIn']
		},
		isModal: true
	});
}

require('./add-torrent-controller');