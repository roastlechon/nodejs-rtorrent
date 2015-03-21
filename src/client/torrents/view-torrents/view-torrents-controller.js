function ViewTorrentsCtrl(njrtLog, $scope, Torrents, $modal, torrents) {

	var logger = njrtLog.getInstance('torrents.TorrentsCtrl');

	logger.debug('TorrentsCtrl loaded.');

	var vm = this;

	vm.Torrents = Torrents;

	vm.Torrents.torrents = torrents;

	vm.predicate = 'name';
	vm.reverse = false;
	vm.status = '';

	vm.torrentInView = function (torrent) {
		console.log(torrent);
	};

	vm.inViewOptions = {
		debounce: 1000
	};

	$scope.floatTheadOptions = {
		useAbsolutePositioning: true,
		zIndex: 999,
		scrollContainer: function(test) {
			return $('.table-wrapper');
		}
	};

	vm.reflowTable = function () {
		$('table.table').trigger('reflow');
	};

}

angular
  .module('njrt.torrents.viewTorrents')
  .controller('njrt.ViewTorrentsCtrl', ['njrtLog', '$scope', 'njrt.Torrents', '$modal', 'torrents', ViewTorrentsCtrl]);
