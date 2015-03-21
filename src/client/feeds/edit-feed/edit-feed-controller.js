function EditFeedCtrl(njrtLog, $state, $previousState, $scope, feed, Feeds, Restangular) {

	var logger = njrtLog.getInstance('njrt.feeds');

	logger.debug('EditFeedCtrl loaded.');

	var vm = this;

	vm.error = false;

	vm.feed = Restangular.copy(feed);
	vm.newFilter = {};

	if (!('path' in vm.feed)) {
		vm.feed.path = '';
	}

	if (vm.feed.path.length > 0) {
		vm.changeTorrentLocation = true;
	}

	if (vm.feed.filters.length > 0) {
		vm.hasRegexFilter = true;
	}

	vm.checkDisabled = function() {

		// If form has been touched, disable submit button.
		if ($scope.editFeed.$pristine) {
			return true;
		}

		// If form is invalid, but filters are added, enable submit button.
		if ($scope.editFeed.$invalid) {
			return true;
		}

		// If form is valid and regex is checked and filters are empty,
		// disable the submit button.
		if (vm.hasRegexFilter && vm.feed.filters.length === 0) {
			return true;
		}
	};

	vm.addFilter = function(filter) {

		vm.feed.filters.push({
			regex: filter.regex,
			type: filter.type
		});
		vm.newFilter = {
			regex: "",
			type: ""
		};
	};

	vm.deleteFilter = function(index) {
		vm.feed.filters.splice(index, 1);
	};

	vm.editFilter = function (index) {
		vm.newFilter = vm.feed.filters[index];
		vm.feed.filters.splice(index, 1);
	};

	vm.editFeed = function (feed) {

		// If changeTorrentLocation option is true, empty path
		if (!vm.changeTorrentLocation) {
			vm.feed.path = '';
		}

		// If has regex filter option, empty filters array
		if (!vm.hasRegexFilter) {
			vm.feed.filters = [];
		}

		Feeds.updateFeed(feed)
			.then(function(data) {
				$previousState.go('modalInvoker');
			}, function(err) {
				handleError(err);
				logger.error(err);
			});
	};

	vm.cancel = function () {
		$previousState.go('modalInvoker');
	};

	function handleError (err) {
		console.log(err);
		vm.error(err);
	}

}

angular
	.module('njrt.feeds.editFeed')
	.controller('njrt.EditFeedCtrl', ['njrtLog', '$state', '$previousState', '$scope', 'feed', 'njrt.Feeds', 'Restangular', EditFeedCtrl]);
