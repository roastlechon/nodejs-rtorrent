var logger = require("winston");
var nconf = require("nconf");
var FeedMe = require("feedme");
var request = require("request");
var mongoose = require("mongoose");
var moment = require("moment");
var Q = require("q");
var feeds = require("../models/feeds");
var torrentFeedParser = require("../lib/torrent-feed-parser");

module.exports = function() {
	setInterval(function() {
		feeds.getAll().then(function(data) {
			data.map(function(feed) {
				torrentFeedParser.getTorrents(feed).then(function(torrents) {
					var addTorrentPromises = torrents.map(function(torrent) {

						return feeds.addTorrent(feed._id, torrent, feed.autoDownload);
					});

					Q.allSettled(addTorrentPromises).then(function(results) {
						results.forEach(function(result) {
							if (result.state === "fulfilled") {
								logger.info("New torrent saved in feed");
							} else {
								if (result.reason.message === "Torrent exists in feed already.") {
									// No need to log here, since it
									// would be very verbose
								} else {
									logger.error(result.reason.message);	
								}
							}
						});

					});
				}, function(err) {
					logger.error(err.message);
				});
			});

		}, function(err) {
			logger.error(err.message);
		});
	}, nconf.get("app:checkFeedLoopInterval"));
}