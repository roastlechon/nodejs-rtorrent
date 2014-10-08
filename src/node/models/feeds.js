var mongoose = require("mongoose");
var FeedMe = require("feedme");
var request = require("request");
var moment = require("moment");
var Torrent = require("./schemas/torrent");
var Filter = require("./schemas/filter");
var Feed = require("./schemas/feed");
var rtorrent = require("../lib/rtorrent");
var torrentFeedParser = require("../lib/torrent-feed-parser");
var logger = require("winston");
var Q = require("q");
var socket = require('../controllers/socket');


var feeds = module.exports = {}

function checkFeedExists(rss) {
	return Feed.findOne({
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
	return Feed.findOne({
		"_id": id
	}).exec();
}

feeds.edit = function(feed) {
	var _id = feed._id;
	delete feed._id;

	var feedExists = Feed.findOne({
		"_id": _id
	}).exec();

	var saveFeed = feedExists.then(function(data) {

		// need this to reparse
		feed.rss = data.rss;

		// Update feed by reparsing data
		return torrentFeedParser.getTorrents(feed)
			.then(function (data) {
				feed.torrents = [];
				for (var i = 0; i < data.length; i++) {
					var torrent = new Torrent({
						name: data[i].name,
						url: data[i].url,
						status: "RSS",
						date: data[i].date
					});
					feed.torrents.push(torrent);
				};

				// Empty filters if regexFilter is false
				if (!feed.regexFilter) {
					feed.filters = [];
				}

				return Feed.update({
					"_id": _id
				}, feed).exec();
			});
	}, function(err) {
		return Q.reject(err);
	});

	return saveFeed;
}

feeds.add = function(feed) {

	return checkFeedExists(feed.rss)
		.then(function(data) {

			// if data doesn't exist, then feed does not exist
			if (!data) {
				logger.info("Feed does not exist.");
				return torrentFeedParser.getTorrents(feed);
			}

			// throw error if feed exists
			throw new Error('Feed exists');
		})
		.then(function(data) {
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
				for (var i = 0; i < feed.filters.length; i++) {
					var filter = new Filter({
						regex: feed.filters[i].regex,
						type: feed.filters[i].type
					});
					feedModel.filters.push(filter);
				};
			}

			if (data) {
				for (var i = 0; i < data.length; i++) {
					var torrent = new Torrent({
						name: data[i].name,
						url: data[i].url,
						status: "RSS",
						date: data[i].date
					});
					feedModel.torrents.push(torrent);
				};
			}

			logger.info("Saving feed to database.");

			return Feed.create(feedModel);
		});
}

feeds.refreshFeed = function (_id) {
	return Feed.findOne({
		"_id": _id
	}).exec().then(function (feed) {
		if (!feed) {
			throw new Error('Cannot find feed');
		}

		return torrentFeedParser.getTorrents(feed)

			.then(function (data) {
				var refreshedFeed = {
					torrents: []
				};
				
				for (var i = 0; i < data.length; i++) {
					var torrent = new Torrent({
						name: data[i].name,
						url: data[i].url,
						status: "RSS",
						date: data[i].date
					});
					refreshedFeed.torrents.push(torrent);
				};

				return Feed.update({
					"_id": _id
				}, refreshedFeed).exec();
			});
	});
}


feeds.deleteFeed = function (_id) {
	return Feed.findOne({
		"_id": _id
	}).exec().then(function (data) {
		if (!data) {
			throw new Error('Cannot find feed');
		}

		return Feed.remove({
			"_id": _id
		}).exec();
	});
}


feeds.addTorrent = function(_id, torrent, autoDownload) {

	var torrentFeed = new Torrent({
		name: torrent.name,
		url: torrent.url,
		status: "RSS",
		date: torrent.date
	});

	return Feed.findOne({
		"_id": _id,
		"torrents.url": torrent.url
	}).exec().then(function (data) {
		if (!data) {
			return Feed.findOne({
				"_id": _id
			}).exec().then(function (data) {
				if (!data) {
					throw new Error ('Feed does not exist.');
				}

				// If autoDownload is true, start the torrent automatically
				if (autoDownload) {
					rtorrent.loadTorrentUrl(torrent.url).then(function() {
						socket.addNotification({type: 'success', message: 'Automatically loaded torrent "' + torrent.url + '"'});
					});
				}

				data.torrents.push(torrentFeed);
				data.save(function(err, doc) {
					socket.addNotification({type: 'success', message: 'New torrent saved in feed "' + data.title + '"'});
				});

				return updateLastChecked(_id, moment().unix());
			});
		}

		throw new Error('Torrent exists in feed already.');
	});
}