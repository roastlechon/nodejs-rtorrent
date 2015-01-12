'use strict';

function AddFeedCtrl (njrtLog, $state, $previousState, $scope, Feeds, Notification) {

	var logger = njrtLog.getInstance('njrt.feeds');

	logger.debug('AddFeedCtrl loaded.');

	var vm = this;

	vm.feed = {
		rss: '',
		title: '',
		changeTorrentLocation: false,
		path: '',
		regexFilter: false,
		autoDownload: false,
		filters: []
	};
	
	vm.newFilter = {};

	vm.error = false;

	vm.checkDisabled = function () {
		// if form is invalid, but filters are added
		// return false to enable submit button
		if ($scope.addFeed.$invalid) {
			
			if (vm.feed.regexFilter && vm.feed.filters.length > 0) {
				return false;
			}

			return true;
		}

		// if form is valid because of filter options being 
		// entered in, but not added, do an additional check
		if (!$scope.addFeed.$invalid) {

			// if regexFilter option is true
			// and no filters were added
			// return true to disable submit button
			if (vm.feed.regexFilter && vm.feed.filters.length === 0) {
				return true;
			}

			return false;
		}
	};

	vm.addFilter = function (filter) {
		
		vm.feed.filters.push({
			regex: filter.regex,
			type: filter.type
		});
		vm.newFilter = {
			regex: "",
			type: ""
		};
	};

	vm.deleteFilter = function (index) {
		vm.feed.filters.splice(index, 1);
	};

	vm.editFilter = function (index) {
		vm.newFilter = vm.feed.filters[index];
		vm.feed.filters.splice(index, 1);
	};

	vm.addRssFeed = function () {
		Feeds.addFeed({
			rss: vm.feed.url,
			title: vm.feed.name,
			path: vm.feed.path,
			changeTorrentLocation: vm.feed.changeTorrentLocation,
			filters: vm.feed.filters,
			regexFilter: vm.feed.regexFilter,
			autoDownload: vm.feed.autoDownload
		}).then(function (data) {
			$previousState.go('modalInvoker');
		}, function (err) {
			handleError(err);
			logger.error(err.data);
		});
	};

	vm.cancel = function () {
		$previousState.go('modalInvoker');
	};

	function handleError (err) {
		console.log(err);
		if (err.data === 'Feed exists') {
			vm.error = 'Feed exists. Please enter in a unique URL.';
		}
	}
}

module.exports = angular
	.module('njrt.feeds.addFeed')
	.controller('njrt.AddFeedCtrl', ['njrtLog', '$state', '$previousState', '$scope', 'njrt.Feeds', 'njrt.Notification', AddFeedCtrl]);