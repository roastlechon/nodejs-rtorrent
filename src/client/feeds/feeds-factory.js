module.exports = angular
	.module('feeds')
	.factory('Feeds', function(njrtLog, Restangular, $q) {

		var logger = njrtLog.getInstance('feeds.Feeds');

		logger.debug('Feeds loaded');

		var Feeds = {};

		Feeds.feeds = [];

		Feeds.getFeeds = function() {
			var deferred = $q.defer();

			Restangular.all("feeds").getList().
				then(function(data) {
					Feeds.feeds = data;
					deferred.resolve(data);
				}, function(err) {
					console.error(err);
					deferred.reject(err);
				});

			return deferred.promise;
		}

		Feeds.getFeed = function(id) {
			var deferred = $q.defer();

			var feed = _.findWhere(Feeds.feeds, {
				_id: id
			});

			if (feed) {
				deferred.resolve(feed);
			} else {
				deferred.reject(new Error('Feed doesn\'t exist.'));
			}

			return deferred.promise;
		}

		Feeds.addFeed = function(feed) {
			var deferred = $q.defer();

			Feeds.feeds.post(feed)
				.then(function (data) {
					Feeds.feeds.push(data);
					deferred.resolve(feed);
				}, function (err) {
					logger.error(err.status, err.statusText, ':', err.data);
					deferred.reject(err);
				});
			return deferred.promise;
		}

		Feeds.updateFeed = function(feed) {
			var deferred = $q.defer();

			feed.put()
				.then(function (data) {
					Feeds.getFeeds()
						.then(function() {
							deferred.resolve(data);
						});
				}, function (err) {
					logger.error(err.status, err.statusText, ':', err.data);
					deferred.reject(err);
				});
			return deferred.promise;
		}

		Feeds.deleteFeed = function(feed) {
			var deferred = $q.defer();

			// delete from server
			feed.remove()
				.then(function () {
					var item = _.findWhere(Feeds.feeds, {
						_id: feed._id
					});

					var index = Feeds.feeds.indexOf(item);
					
					// delete from collection
					if (index > -1) {
						Feeds.feeds.splice(index, 1);
					}

					deferred.resolve('deleted');
				}, function (err) {
					console.error(err);
					deferred.reject(err);
				});

			return deferred.promise;
		}

		

		return Feeds;

	});