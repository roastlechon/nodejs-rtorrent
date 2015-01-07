'use strict';

function FeedsCtrl (njrtLog, $scope, $previousState, $modal, Feeds, feeds) {

	var logger = njrtLog.getInstance('njrt.feeds');

	logger.debug('FeedsCtrl loaded.');

	var vm = this;

	vm.Feeds = Feeds;

	vm.reverse = true;
	vm.predicate = 'lastChecked';

	$scope.floatTheadOptions = {
		useAbsolutePositioning: true,
		zIndex: 999,
		scrollContainer: function(test) {
			console.log(test);
			return $('.table-wrapper');
		}
	};

	vm.reflowTable = function () {
		$('table.table').trigger('reflow');
	};
	
}

module.exports = angular
	.module('njrt.feeds.viewFeeds')
	.controller('njrt.ViewFeedsCtrl', ['njrtLog', '$scope', '$previousState', '$modal', 'njrt.Feeds', 'feeds', FeedsCtrl]);