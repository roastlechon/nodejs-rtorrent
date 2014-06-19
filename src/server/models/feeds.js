var mongoose = require("mongoose");
var FeedMe = require("feedme");
var request = require("request");
var async = require("async");
var moment = require("moment");
var Torrent = require("./schemas/torrent");
var Filter = require("./schemas/filter");
var Feed = require("./schemas/feed");
var rtorrent = require("../lib/rtorrent");
var torrentFeedParser = require("../lib/torrent-feed-parser");
var _ = require("underscore");
var logger = require("winston");
var Q = require("q");


var feeds = module.exports = {}

function checkFeedExists(rss) {
	return Feed.find({
		"rss": rss
	}).exec();
}


function updateLastChecked(_id, time) {
	return Feed.update({
		"_id": _id
	}, {
		"lastChecked": time
	}).exec();
}

feeds.getAll = function() {
	return Feed.find({}).sort({
		"title": "ascending"
	}).exec();
}

feeds.get = function(id) {
	return Feed.find({
		"_id": id
	}).exec();
}

feeds.edit = function(feed) {
	var _id = feed._id;
	delete feed._id;

	var feedExists = Feed.find({
		"_id": _id
	}).exec();

	var saveFeed = feedExists.then(function(data) {
		


		// Empty filters if regexFilter is false
		if (!feed.regexFilter) {
			feed.filters = [];
		}

		return Feed.update({
			"_id": _id
		}, feed).exec();
	}, function(err) {
		return Q.reject(err);
	});

	return saveFeed;
}

feeds.add = function(feed) {
	console.log(feed);
	var deferred = Q.defer();

	var feedExists = checkFeedExists(feed.rss)

	var torrentsFromFeed = feedExists.then(function(data) {
		if (data.length === 0) {
			logger.info("Feed does not exist.");
			return torrentFeedParser.getTorrents(feed);
		}

		return Q.reject("Feed exists");
	}, function(err) {
		return Q.reject(err);
	});

	var saveFeed = torrentsFromFeed.then(function(data) {
		logger.info("Getting torrents from feed.");
		var feedModel = new Feed({
			title: feed.title,
			lastChecked: moment().unix(),
			rss: feed.rss,
			regexFilter: feed.regexFilter,
			autoDownload: feed.autoDownload,
			filters: [],
			torrents: []
		});
		
		if (feed.regexFilter) {
			_.each(feed.filters, function(fil) {
				var filter = new Filter({
					regex: fil.regex,
					type: fil.type
				});
				feedModel.filters.push(filter);
			});
		}

		_.each(data, function(tor) {
			var torrent = new Torrent({
				name: tor.name,
				url: tor.url,
				status: "RSS",
				date: tor.date
			});
			feedModel.torrents.push(torrent);
		});

		logger.info("Saving feed to database.");

		feedModel.save();
		return Q(feedModel);
	}, function(err) {
		return Q.reject(err);
	});

	saveFeed.then(function(data) {
		deferred.resolve(data);
	}, function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
}


feeds.delete = function(_id) {
	return Feed.findOneAndRemove({
		"_id": _id
	}).exec();
}


feeds.addTorrent = function(_id, torrent, autoDownload) {
	var deferred = Q.defer();

	var torrentFeed = new Torrent({
		name: torrent.name,
		url: torrent.url,
		status: "RSS",
		date: torrent.date
	});

	var findTorrentInFeed = Feed.findOne({
		"_id": _id,
		"torrents.url": torrent.url
	}).exec();

	var findFeed = findTorrentInFeed.then(function(data) {
		if (!data) {
			return Feed.findOne({
				"_id": _id
			}).exec();
		}

		return Q.reject("Torrent exists in feed already.");
	}, function(err) {
		return Q.reject(err);
	});

	var saveFeed = findFeed.then(function(data) {
		if (!data) {
			return Q.reject("Feed does not exist");
		}

		// If autoDownload is true, start the torrent automatically
		if (autoDownload) {
			rtorrent.loadTorrentUrl(torrent.url);
		}

		data.torrents.push(torrentFeed);
		data.save();
		return Q(data);
	}, function(err) {
		return Q.reject(err);
	});


	var updateLastCheckedTimestamp = saveFeed.then(function(data) {
		return updateLastChecked(_id, moment().unix());
	}, function(err) {
		return Q.reject(err);
	});

	updateLastCheckedTimestamp.then(function(data) {
		return deferred.resolve(data);
	}, function(err) {
		return deferred.reject(err);
	});

	return deferred.promise;
}