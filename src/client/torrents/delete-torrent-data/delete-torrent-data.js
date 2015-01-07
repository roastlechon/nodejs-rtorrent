module.exports = angular
	.module('njrt.torrents.deleteTorrentData', [])
	.config(['$stateProvider', config]);

function resolve (Torrents, $stateParams) {
	return Torrents.getTorrent($stateParams.id);
}

function config ($stateProvider) {
	$stateProvider.state('deleteTorrentData', {
		url: '/deleteTorrentData/:id',
		views: {
			'modal@': {
				templateUrl: 'torrents/delete-torrent-data/delete-torrent-data.tpl.html',
				controller: 'njrt.DeleteTorrentDataCtrl as deleteTorrentDataCtrl'
			}
		},
		isModal: true,
		data: {
			rule: ['isLoggedIn']
		},
		resolve: {
			torrent: ['njrt.Torrents', '$stateParams', resolve]
		}
	});
}

require('./delete-torrent-data-controller');