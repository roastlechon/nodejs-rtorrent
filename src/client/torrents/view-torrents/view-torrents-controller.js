function ViewTorrentsCtrl(njrtLog, $scope, Torrents, torrents, $interval) {

	var logger = njrtLog.getInstance('torrents.TorrentsCtrl');

	logger.debug('TorrentsCtrl loaded.');

	var vm = this;

	vm.Torrents = Torrents;
  vm.Torrents.torrents = torrents.data;
  vm.Torrents.totalSize = torrents.total;
  vm.Torrents.totalLoaded = torrents.data.length;

  vm.tableVirtualScrollOptions = {
    selectRow: function (hash) {
      Torrents.selectTorrent(hash);
    },
    isRowSelected: function (hash) {
      return Torrents.isTorrentSelected(hash);
    },
    dataSource: {
      data: torrents.data,
      totalSize: torrents.total
    },
    getData: function (options) {
      return Torrents.getTorrents(options);
    }
  };

  $interval(function () {
    Torrents.getTorrentsByHash(vm.tableVirtualScrollOptions.inViewHashes)
      .then(function (data) {
        for (var i = data.length - 1; i >= 0; i--) {
          var index = _.findIndex(vm.tableVirtualScrollOptions.dataSource.data, function (torrent) {
            return data[i].hash === torrent.hash;
          });
          if (index > -1) {
            vm.tableVirtualScrollOptions.dataSource.data[index] = data[i];
          }
        }

      });

      vm.tableVirtualScrollOptions.deleteRows(Torrents.cleanup);
      Torrents.cleanup = [];
  }, 1000);

	$scope.floatTheadOptions = {
		useAbsolutePositioning: true,
		zIndex: 999,
		scrollContainer: function () {
			return $('.table-wrapper');
		}
	};

	vm.reflowTable = function () {
		$('table.table').trigger('reflow');
	};

}

angular
  .module('njrt.torrents.viewTorrents')
  .controller('njrt.ViewTorrentsCtrl', ['njrtLog', '$scope', 'njrt.Torrents', 'torrents', '$interval', ViewTorrentsCtrl]);
