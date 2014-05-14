var logger = require("winston");
var nconf = require("nconf");
var FeedMe = require("feedme");
var request = require("request");
var mongoose = require("mongoose");
var Q = require("q");
var rssfeeds = require("../models/rssfeeds");
var torrentFeedParser = require("../lib/torrent-feed-parser");

module.exports = function() {
	setInterval(function() {
		logger.info("interval loop");
		rssfeeds.getAll().then(function(data) {
			data.map(function(feed) {
				torrentFeedParser.getTorrents(feed).then(function(torrents) {
					var addTorrentPromises = torrents.map(function(torrent) {

						return rssfeeds.addTorrent(feed._id, torrent, feed.autoDownload);
					});

					Q.allSettled(addTorrentPromises).then(function(results) {
						results.forEach(function(result) {
							if (result.state === "fulfilled") {
								logger.info("New torrent saved in feed");
							} else {
								if (result.reason === "Torrent exists in feed already.") {

								} else {
									logger.error(result.reason);	
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