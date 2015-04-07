function resolve(Torrents) {
	return Torrents.getTorrents({
    skip: 0,
    limit: 100,
    sortBy: 'name',
    reverse: false,
    filter: null
  });
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
  .module('njrt.torrents.viewTorrents', [])
  .config(['$stateProvider', config]);
