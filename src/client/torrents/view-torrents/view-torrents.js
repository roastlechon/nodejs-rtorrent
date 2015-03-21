function resolve(Torrents) {
	return Torrents.getTorrents();
}

function config($stateProvider) {
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
		},
		resolve: {
			torrents: ['njrt.Torrents', resolve]
		}
	});
}

angular
  .module('njrt.torrents.viewTorrents', [
    'vs-repeat'
  ])
  .config(['$stateProvider', config]);
