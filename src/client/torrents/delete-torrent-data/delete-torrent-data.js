module.exports = angular
	.module('njrt.torrents.deleteTorrentData', [])
	.config(['$stateProvider', config]);

function resolve (Torrents, $stateParams) {
	var hashes = $stateParams.id.split(',');
	return Torrents.getTorrent(hashes);
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