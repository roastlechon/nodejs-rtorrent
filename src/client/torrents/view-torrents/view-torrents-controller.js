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
      totalSize: torrents.total,
      totalLoaded: torrents.data.length
    },
    getData: function (options) {
      return Torrents.getTorrents(options);
    },
    columns: {
      name: {
        visible: true
      },
      status: {
        visible: true
      },
      size: {
        visible: true
      },
      done: {
        visible: true
      },
      downloaded: {
        visible: true
      },
      uploaded: {
        visible: true
      },
      dl: {
        visible: true
      },
      ul: {
        visible: true
      },
      eta: {
        visible: true
      },
      peers: {
        visible: true
      },
      seeds: {
        visible: true
      }
    }
  };

  $scope.$watch(function() {
    return vm.searchText;
  }, function (newVal, oldVal) {
    if(newVal === oldVal) {
      return;
    }

    vm.tableVirtualScrollOptions.filter({
      status: vm.filterStatus,
      name: newVal
    });
  });

  vm.filterByStatus = function (status) {
    vm.filterStatus = status;
    vm.tableVirtualScrollOptions.filter({
      name: vm.searchText,
      status: status
    });
  };

  $interval(function () {
    Torrents.getTorrents({
      filter: {
        hash: vm.tableVirtualScrollOptions.inViewHashes
      }
    })
      .then(function (data) {
        data = data.data;
        for (var i = data.length - 1; i >= 0; i--) {
          var index = _.findIndex(vm.tableVirtualScrollOptions.dataSource.data, {
            hash: data[i].hash
          });
          if (index > -1) {
            vm.tableVirtualScrollOptions.dataSource.data[index] = data[i];
          }

          index = _.findIndex(vm.tableVirtualScrollOptions.dataSource.displayData, {
            hash: data[i].hash
          });
          if (index > -1) {
            vm.tableVirtualScrollOptions.dataSource.displayData[index] = data[i];
          }
        }

      });

      vm.tableVirtualScrollOptions.deleteRows(Torrents.cleanup);
      vm.tableVirtualScrollOptions.refreshRows(Torrents.refreshRows, function () {
        Torrents.refreshRows = false;
      });

      Torrents.cleanup = [];
  }, 1000);

	vm.reflowTable = function () {
		$('table.table').trigger('reflow');
	};

}

angular
  .module('njrt.torrents.viewTorrents')
  .controller('njrt.ViewTorrentsCtrl', ['njrtLog', '$scope', 'njrt.Torrents', 'torrents', '$interval', ViewTorrentsCtrl]);
