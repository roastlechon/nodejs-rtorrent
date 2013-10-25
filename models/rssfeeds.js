var mongoose = require("mongoose");
var FeedMe = require("feedme");
var request = require("request");
var async = require("async");
var Feed = mongoose.model("Feed");
var Torrent = mongoose.model("Torrent");
var _ = require("underscore");
var logger = require("winston");

var rssFeeds = module.exports = {}

rssFeeds.getRSSFeeds = function(callback) {
	Feed.find({}).sort({
		title: "desc"
	}).exec(function(errors, results) {
		if (errors) {
			logger.error("errors occured in rssFeeds.getRSSFeeds", errors);
		} else {
			logger.info("successfully retrieved rss feeds from database");
			var feeds = results.map(function(result) {
				var resultFeed = {};
				resultFeed._id = result._id;
				resultFeed.title = result.title;
				resultFeed.rss = result.rss;
				resultFeed.torrents = result.torrents.sort(function(a, b) {
					a = a.date;
					b = b.date;
					return a > b ? -1 : a < b ? 1 : 0;
				});
				return resultFeed;
			});
		}
		callback(feeds, errors);
	});
}

rssFeeds.getRSSFeed = function(id, callback) {
	logger.info("checking database if feed exists");
	Feed.find({
		"_id": id
	}, function(errors, results) {
		if (errors) {
			logger.error("errors occured in find");
			logger.error(errors);
			callback(errors, null);
		} else {
			logger.info("success in find");
			logger.info(results);
			callback(null, results);
		}
	});
}

rssFeeds.updateRSSFeed = function(id, feed, callback) {
	logger.info("updating feed: " + id);
	Feed.update({
		"_id": id
	}, {
		"title": feed.title,
		"rss": feed.rss
	}, function(errors, results) {
		if (errors) {
			logger.error("errors occured in updating feed");
			logger.error(errors);
			callback(errors, null);
		} else {
			logger.info("success in updating");
			logger.info(results);
			callback(null, results);
		}
	});
}

rssFeeds.saveRSSFeed = function(feed, callback) {

	var feed = new Feed({
		title: feed.title,
		rss: feed.rss,
		torrents: []
	});

	rssFeeds.checkFeedExists(feed.rss, function(errors, results) {
		if (errors) {
			logger.error("errors occured when checking for feed in database");
			logger.error(errors);
		} else {
			if (results.length === 0) {
				rssFeeds.getTorrentsFromFeed(feed.rss, function(results) {
					_.each(results, function(tor) {
						var torrent = new Torrent({
							name: tor.name,
							url: tor.url,
							status: "RSS",
							date: tor.date
						});
						feed.torrents.push(torrent);
					});

					logger.info("feed does not exist");
					logger.info("saving to database");

					feed.save(function(errors, feed) {
						if (errors) {
							logger.error("errors occured trying to save");
							logger.error(errors);
							callback(errors, null);
						} else {
							logger.info("saved");
							callback(null, feed)
						}
					});
				});
			}
		}
	});
}

rssFeeds.getTorrentsFromFeed = function(rss, callback) {
	var results = [];

	var parser = new FeedMe();

	logger.info("rss feed is %s", rss);

	var r = request({
		uri: rss,
		headers: {
			'User-Agent': 'NodeJS',
			'Content-Type': 'text/xml',
			'Accept': 'text/xml',
			'Accept-Charset': 'UTF8',
			'Connection': 'Close'
		}
	});

	r.on("response", function(response) {
		parser.on("error", function(error) {
			logger.error("errors occured on parsing");
			logger.error(error);
			// might need to callback here with errors
		});

		parser.on("item", function(item) {
			var tor = rssFeeds.adaptItemToTorrent(item);
			results.push(tor);
		});

		parser.on("end", function() {
			logger.info("finished parsing rss feed");
			callback(results);
		});
		r.pipe(parser);
	});

	r.on("error", function(error) {
		logger.error("errors occured in stream");
		logger.error(error);
	});

}

rssFeeds.checkFeedExists = function(rss, callback) {
	logger.info("checking database if feed exists");
	Feed.find({
		"rss": rss
	}, function(errors, results) {
		if (errors) {
			logger.error("errors occured in checking if feed exists");
			logger.error(errors);
			callback(errors, null);
		} else {
			logger.info("successfully found feed");
			logger.info(results);			
			callback(null, results);
		}
	});
}

rssFeeds.updateFeeds = function() {

}

rssFeeds.deleteFeed = function(_id, callback) {
	Feed.findOne({
		_id: _id
	}, function(errors, doc) {
		if (errors) {
			logger.error("feed doesnt exist");
			logger.error(errors);
			callback(errors, null);
		} else {
			logger.info("removing feed %s", _id);
			doc.remove();
			callback(null, doc);
		}
	});
}


rssFeeds.addTorrentToFeed = function(_id, torrent, callback) {
	// logger.info("adding torrent to feed " + _id);
	logger.info(torrent);

	var torrentFeed = new Torrent({
		name: torrent.name,
		url: torrent.url,
		status: "RSS",
		date: torrent.date
	});

	Feed.findOne({
		_id: _id
	}, function(errors, doc) {
		if (errors) {
			logger.error("feed doesnt exist");
			callback(errors, null);
		} else {
			Feed.findOne({
				"torrents.url": torrent.url
			}, function(errors, subdoc) {
				if (errors) {
					callback(errors, null);
				} else {
					if (!subdoc) {
						logger.info("new torrent");
						doc.torrents.push(torrentFeed);
						doc.save();
						callback(null, doc);
					} else {
						// logger.info("torrent exists");
						callback(null, null);
					}
				}
			});
		}
	});
}

rssFeeds.adaptItemToTorrent = function(item) {
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

	return tor;
}