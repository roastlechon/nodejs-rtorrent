'use strict';

function Feeds (njrtLog, Restangular, $q) {

	var logger = njrtLog.getInstance('njrt.feeds');

	logger.debug('Feeds loaded.');

	var Feeds = {};

	Feeds.feeds = [];

	Feeds.getFeeds = function () {
		return Restangular.all('feeds').getList()
			.then(function (data) {
				Feeds.feeds = data;
				return Feeds.feeds;
			});
	};

	Feeds.getFeed = function (id) {
		return Restangular.one('feeds', id).get();
	};

	Feeds.addFeed = function (feed) {
		return Restangular.all('feeds').post(feed)
			.then(function (data) {
				Feeds.feeds.push(data);
				return data;
			});
	};

	Feeds.refreshFeed = function (id) {
		return Restangular.one('feeds', id).post('refresh', {})
			.then(function (data) {
				return Feeds.getFeeds()
					.then(function () {
						return data;
					});
			});
	};

	Feeds.updateFeed = function (feed) {
		return feed.put()
			.then(function (data) {
				return Feeds.getFeeds()
					.then(function () {
						return data;
					});
			});
	};

	Feeds.deleteFeed = function (feed) {
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
	};

	return Feeds;
}

module.exports = angular
	.module('njrt.feeds')
	.factory('njrt.Feeds', ['njrtLog', 'Restangular', '$q', Feeds]);