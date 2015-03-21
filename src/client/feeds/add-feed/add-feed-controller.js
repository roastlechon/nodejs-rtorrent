function AddFeedCtrl(njrtLog, $state, $previousState, $scope, Feeds, Notification, downloadSettings) {

	var logger = njrtLog.getInstance('njrt.feeds');

	logger.debug('AddFeedCtrl loaded.');

	var vm = this;

	vm.feed = {
		rss: '',
		title: '',
		path: '',
		autoDownload: false,
		filters: []
	};

	vm.defaultDownloadPath = downloadSettings.download_directory;

	vm.newFilter = {};

	vm.error = false;

	vm.checkDisabled = function () {
		// if form is invalid, but filters are added
		// return false to enable submit button
		if ($scope.addFeed.$invalid) {

			if (vm.hasRegexFilter && vm.feed.filters.length > 0) {
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
			if (vm.hasRegexFilter && vm.feed.filters.length === 0) {
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

		// If changeTorrentLocation option is true, empty path
		if (!vm.changeTorrentLocation) {
			vm.feed.path = '';
		}

		// If has regex filter option, empty filters array
		if (!vm.hasRegexFilter) {
			vm.feed.filters = [];
		}

		Feeds.addFeed({
			rss: vm.feed.url,
			title: vm.feed.name,
			path: vm.feed.path,
			filters: vm.feed.filters,
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

angular
	.module('njrt.feeds.addFeed')
	.controller('njrt.AddFeedCtrl', ['njrtLog', '$state', '$previousState', '$scope', 'njrt.Feeds', 'njrt.Notification', 'downloadSettings', AddFeedCtrl]);
