module.exports = angular
	.module('feeds.add')
	.controller('FeedsAddCtrl', function(njrtLog, $state, $scope, Feeds, Notification) {

		var logger = njrtLog.getInstance('feeds.add.FeedsAddCtrl');

		logger.debug('FeedsAddCtrl loaded.');

		var vm = this;

		vm.feed = {
			rss: '',
			title: '',
			regexFilter: false,
			autoDownload: false,
			filters: []
		};
		vm.newFilter = {};

		vm.error = false;

		vm.checkDisabled = function() {
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
		}

		vm.addFilter = function(filter) {
			
			vm.feed.filters.push({
				regex: filter.regex,
				type: filter.type
			});
			vm.newFilter = {
				regex: "",
				type: ""
			};
		}

		vm.deleteFilter = function(index) {
			vm.feed.filters.splice(index, 1);
		}

		vm.editFilter = function (index) {
			vm.newFilter = vm.feed.filters[index];
			vm.feed.filters.splice(index, 1);
		}

		vm.addRssFeed = function() {
			Feeds.addFeed({
				rss: vm.feed.url,
				title: vm.feed.name,
				filters: vm.feed.filters,
				regexFilter: vm.feed.regexFilter,
				autoDownload: vm.feed.autoDownload
			}).then(function(data) {
				$state.go('home.feeds');
			}, function(err) {
				handleError(err);
				logger.error(err.data);
			});
		}

		vm.cancel = function() {
			$state.go('home.feeds');
		}

		function handleError (err) {
			console.log(err);
			if (err.data === 'Feed exists') {
				vm.error = 'Feed exists. Please enter in a unique URL.';
			}
		}
	});