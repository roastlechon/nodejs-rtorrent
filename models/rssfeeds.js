var mongoose = require("mongoose");
var FeedMe = require("feedme");
var request = require("request");
var async = require("async");
var moment = require("moment");
var Torrent = require("./schemas/torrent");
var Feed = require("./schemas/feed");
var torrentFeedParser = require("../lib/torrent-feed-parser");
var _ = require("underscore");
var logger = require("winston");
var Q = require("q");


var rssFeeds = module.exports = {}

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

rssFeeds.getAll = function() {
	return Feed.find({}).sort({
		"title": "ascending"
	}).exec();
}

rssFeeds.get = function(id) {
	return Feed.find({
		"_id": id
	}).exec();
}

rssFeeds.edit = function(id, feed) {
	return Feed.update({
		"_id": id
	}, {
		"title": feed.title,
		"rss": feed.rss
	}).exec();
}

rssFeeds.add = function(feed) {
	var deferred = Q.defer();

	var feedExists = checkFeedExists(feed.rss)

	var torrentsFromFeed = feedExists.then(function(data) {
		console.log("feed exists");
		console.log(data);
		if (data.length === 0) {
			return torrentFeedParser.getTorrents(feed.rss);
		}

		return Q.reject("Feed does not exist");

	}, function(err) {
		return Q.reject(err);
	});

	var saveFeed = torrentsFromFeed.then(function(data) {
		console.log("getting torrents from feed");
		var feedModel = new Feed({
			title: feed.title,
			lastChecked: moment().unix(),
			rss: feed.rss,
			torrents: []
		});

		_.each(data, function(tor) {
			var torrent = new Torrent({
				name: tor.name,
				url: tor.url,
				status: "RSS",
				date: tor.date
			});
			feedModel.torrents.push(torrent);
		});

		logger.info("feed does not exist");
		logger.info("saving to database");

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


rssFeeds.delete = function(_id) {
	return Feed.findOneAndRemove({
		"_id": _id
	}).exec();
}


rssFeeds.addTorrent = function(_id, torrent) {
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