function resolve(Settings) {
	return Settings.getDownloadSettings();
}

function config($stateProvider) {
	$stateProvider.state('addTorrent', {
		url: '/add-torrent',
		views: {
			'modal@': {
				templateUrl: 'torrents/add-torrent/add-torrent.tpl.html',
				controller: 'njrt.AddTorrentCtrl as torrentsAddCtrl'
			}
		},
		data: {
			rule: ['isLoggedIn']
		},
		resolve: {
			downloadSettings: ['njrt.Settings', resolve]
		},
		isModal: true
	});
}

angular
  .module('njrt.torrents.addTorrent', [])
  .config(['$stateProvider', config]);
