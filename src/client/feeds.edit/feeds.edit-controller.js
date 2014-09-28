module.exports = angular
	.module('feeds.edit')
	.controller('FeedsEditCtrl', function(njrtLog, $state, $scope, feed, Feeds, Restangular) {
		
		var logger = njrtLog.getInstance('feeds.edit.FeedsEditCtrl');

		logger.debug('FeedsEditCtrl loaded.');

		var vm = this;

		vm.feed = Restangular.copy(feed);
		vm.newFilter = {};
		vm.feed.filters = [];

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

		vm.editFeed = function (feed) {
			Feeds.updateFeed(feed)
				.then(function(data) {
					console.log(data);
					$state.go('home.feeds');
				}, function(err) {
					logger.error(err);
				});
		}

		vm.cancel = function () {
			$state.go('home.feeds');
		}

	});