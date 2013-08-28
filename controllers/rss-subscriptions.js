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
				logger.info("feed url: " + resultFeed.rss);

				var parser = new FeedMe();
				request(resultFeed.rss).pipe(parser);

				parser.on("error", function(error) {
					logger.error("error occured during parsing feed");
					logger.error(error);
				});
				parser.on('item', function(item) {

					//console.dir(item);

					// temporary object
					var tor = {};

					//convert item into torrent object
					if (item.title) {
						// console.log(item.title);
						tor.name = item.title;
					}

					// order enclosure first
					// if item is enclosure
					if (item.enclosure) {
						//console.log(item.enclosure);

						// if item enclosure has url
						if (item.enclosure["url"]) {
							// console.log(item.enclosure["url"]);
							tor.url = item.enclosure["url"];
						}

						// if item is link
					} else if (item.link) {
						// console.log(item.link);
						tor.url = item.link;
					}

					// if item has date
					if (item.pubdate) {
						// console.log(item.pubdate);
						tor.date = new Date(item.pubdate);
					} else if (item.pubDate) {
						// console.log(item.pubDate);
						tor.date = new Date(item.pubDate);
					} else if (item.timestamp) {
						// console.log(item.timestamp);
						tor.date = new Date(item.timestamp);
					}

					var torrent = new Torrent({
						name: tor.name,
						url: tor.url,
						status: "RSS",
						date: tor.date
					});

					Feed.findOne({
						rss: resultFeed.rss
					}, function(errors, doc) {
						if (!doc) {
							// console.log("feed doesnt exist exists");
						} else {
							Feed.findOne({
								"torrents.url": tor.url
							}, function(errors2, subdoc) {
								if (!subdoc) {
									// console.log("subdoc doesnt exist");
									logger.info("new torrent");
									logger.info(torrent);
									doc.torrents.push(torrent);
									doc.save();
								} else {
									// console.log("subdoc exists");
								}
							});
						}
					});
				});

			});
		});
	}, 300000);

	// end loop
}