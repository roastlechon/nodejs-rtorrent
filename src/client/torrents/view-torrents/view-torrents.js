module.exports = angular
	.module('njrt.torrents.viewTorrents', [])
	.config(function($stateProvider) {
		$stateProvider.state('top.torrents', {
			url: 'torrents',
			views: {
				'content@top': {
					controller: 'njrt.ViewTorrentsCtrl as torrentsCtrl',
					templateUrl: 'torrents/view-torrents/view-torrents.tpl.html'
				}
			},
			data: {
				rule: ['isLoggedIn']
			}
		});
	});

require('./view-torrents-controller');