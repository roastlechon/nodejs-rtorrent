var logger = require("winston");
var FeedMe = require("feedme");
var request = require("request");
var mongoose = require("mongoose");
var Feed = mongoose.model("Feed");
var Torrent = mongoose.model("Torrent");
var rssfeeds = require("../models/rssfeeds");

module.exports = function() {
	setInterval(function() {
		logger.info("interval loop");
		rssfeeds.getRSSFeeds(function(results) {
			results.map(function(resultFeed) {
				logger.info("feed url: %s", resultFeed.rss);

				// console.log(resultFeed);

				var parser = new FeedMe();
				var r = request({
					url: resultFeed.rss,
					headers: {
						'User-Agent': 'NodeJS',
						'Content-Type': 'text/xml',
						'Accept': 'text/xml',
						'Accept-Charset': 'UTF8',
						'Connection': 'Close'
					},
					timeout: 5000
				});

				r.on("response", function(response) {
					parser.on('item', function(item) {

						var tor = rssfeeds.adaptItemToTorrent(item);

						// logger.info("constructed torrent object from item");
						// logger.info(tor);

						rssfeeds.addTorrentToFeed(resultFeed._id, tor, function(errors, doc) {
							if (errors) {
								logger.error("error occured when adding torrent to feed");
								logger.error(errors);
							} else {
								if (!doc) {
									// logger.info("torrent exists");
								} else {
									logger.info("saved torrent successfully");
									// logger.info(tor);
									// logger.info(doc);
								}
							}
						});
					});
					parser.on("error", function(error) {
						logger.error("error occured during parsing feed");
						logger.error(error);
					});

				});

				r.on("error", function(error) {
					logger.error("errors occured in stream");
					logger.error(error);
				});

				r.pipe(parser);



			});
			logger.info("finished getting rss feeds");
		});
	}, 300000);
	// 300000
	// end loop
}

