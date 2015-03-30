function resolve(Torrents, $stateParams) {
  var hash = [];
  if ($stateParams.id) {
    hash = $stateParams.id.split(',');
  }
  return Torrents.getTorrentsByHash(hash);
}

function config($stateProvider) {
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

angular
  .module('njrt.torrents.deleteTorrentData', [])
  .config(['$stateProvider', config]);
