module.exports = angular
	.module('njrt.torrents.viewTorrents')
	.controller('njrt.ViewTorrentsCtrl', ['njrtLog', '$scope', 'njrt.Torrents', '$modal', ViewTorrentsCtrl]);

function ViewTorrentsCtrl (njrtLog, $scope, Torrents, $modal) {
		
	var logger = njrtLog.getInstance('torrents.TorrentsCtrl');
	
	logger.debug('TorrentsCtrl loaded.');

	var vm = this;

	vm.Torrents = Torrents;

	vm.predicate = 'name';
	vm.reverse = false;
	vm.status = '';

	$scope.floatTheadOptions = {
		useAbsolutePositioning: true,
		zIndex: 999,
		scrollContainer: function(test) {
			return $('.table-wrapper');
		}
	};

	vm.reflowTable = function () {
		$('table.table').trigger('reflow');
	}

}