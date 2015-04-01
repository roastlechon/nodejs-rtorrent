'use strict';

function ViewFeedCtrl (njrtLog, $state, $scope, feed, Torrents) {

	var logger = njrtLog.getInstance('njrt.feed');

	logger.debug('ViewFeedCtrl loaded.');

	var vm = this;

	vm.feed = feed;

	vm.reverse = true;
	vm.predicate = 'date';

	vm.loadTorrent = function (url) {

		var torrent = {
			url: url
		};

		if (feed.changeTorrentLocation) {
			torrent.path = feed.path;
		}

		Torrents.load(torrent);
	};

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
	.module('njrt.feeds.viewFeed')
	.controller('njrt.ViewFeedCtrl', ['njrtLog', '$state', '$scope', 'feed', 'njrt.Torrents', ViewFeedCtrl]);