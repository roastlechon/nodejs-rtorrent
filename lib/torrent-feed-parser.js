var logger = require("winston");
var Q = require("q");
var FeedMe = require("feedme");
var request = require("request");

var torrentFeedParser = module.exports = {};

function adaptItemToTorrent(item) {
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

function evaluateRules(torrent, includeRules, excludeRules) {
	var saveTorrent = false;

	// If torrent name matches any include rules,
	// return true and break loop
	for (var i = includeRules.length - 1; i >= 0; i--) {
		if (torrent.name.match(new RegExp(includeRules[i]))) {
			saveTorrent = true;
			break;
		}
	};

	// If torrent name matches any exclude rules,
	// return false and break loop
	for (var i = excludeRules.length - 1; i >= 0; i--) {
		if (torrent.name.match(new RegExp(excludeRules[i]))) {
			saveTorrent = false;
			break;
		} else {
			saveTorrent = true;
			break;
		}
	};

	return saveTorrent;
}

torrentFeedParser.getTorrents = function(feed) {
	var rss = feed.rss;
	var filters = feed.filters;
	var regexFilter = feed.regexFilter;

	logger.info("Parsing feed: %s", rss);	

	var deferred = Q.defer();

	var parser = new FeedMe();

	var torrents = [];
	
	var includeRegexRules = [];
	var excludeRegexRules = [];

	if (regexFilter) {
		logger.info("Feed has regex rules.");
		for (var i = filters.length - 1; i >= 0; i--) {

			switch(filters[i].type) {
				case "include":
					includeRegexRules.push(filters[i].regex);
				break;
				case "exclude":
					excludeRegexRules.push(filters[i].regex);
				break;
				default:
			}
		}
	}
	

	var r = request({
		url: rss,
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

			var torrent = adaptItemToTorrent(item);

			if (regexFilter) {

				// Evaluate rules based on regular expressions
				if (evaluateRules(torrent, includeRegexRules, excludeRegexRules)) {
					torrents.push(torrent);
				}

			} else {

				torrents.push(torrent);
			}

		});

		parser.on("error", function(err) {
			logger.error("Error occurred while parsing feed: " + err.message);
			deferred.reject(err);
		});

		parser.on("end", function() {
			logger.info("Finished parsing feed: %s", rss);
			deferred.resolve(torrents);
		});

	});

	r.on("error", function(err) {
		logger.error("Error occurred while reading from stream: " + err.message);
		deferred.reject(err);
	});

	r.pipe(parser);

	return deferred.promise;
}