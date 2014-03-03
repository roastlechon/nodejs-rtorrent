var rssfeeds = require("../models/rssfeeds");
var logger = require("winston");
var auth = require("./auth.js");
var Q = require("q");

module.exports = function(app) {
	app.get("/rssfeeds", auth.ensureAuthenticated, getRSSFeeds);
	app.get("/rssfeeds/:id", auth.ensureAuthenticated, getRSSFeed);
	app.post("/rssfeeds", auth.ensureAuthenticated, addRSSFeed);
	app.put("/rssfeeds/:id", auth.ensureAuthenticated, updateRSSFeed);
	app.del("/rssfeeds/:id", auth.ensureAuthenticated, deleteRSSFeed);
}

function getRSSFeeds(req, res) {
	rssfeeds.getAll().then(function(data) {
		logger.info("successfully retrieved rss feeds");
		res.json(data.map(function(feed) {
			return {
				_id: feed._id,
				title: feed.title,
				lastChecked: feed.lastChecked,
				rss: feed.rss,
				torrents: feed.torrents.sort(function(a, b) {
					a = a.date;
					b = b.date;
					return a > b ? -1 : a < b ? 1 : 0;
				})
			};
		}));
	}, function(err) {
		logger.error("errors occured in getRSSFeeds");
		logger.error(err.message);
		res.json(err);
	});
}

function addRSSFeed(req, res) {

	var feed = {
		title: req.body.title,
		rss: req.body.rss
	};

	//check database if feed exists
	//if feed does not exist, create new feedsub
	//get list of feeds to return to client

	rssfeeds.add(feed).then(function(data) {
		logger.info("successfully saved rss feed");
		res.json(data);
	}, function(err) {
		logger.error("errors occured in saveRSSFeed");
		logger.error(err);
		res.json(err);
	});
}

function getRSSFeed(req, res) {
	logger.info("getting single rss feed: %s", req.params.id);

	rssfeeds.get(req.params.id).then(function(data) {
		logger.info("successfully retrieved rss feed");
		res.json(data[0]);
	}, function(err) {
		logger.error("Error occured: %s", err.message);
		res.json(err);
	});
}

function updateRSSFeed(req, res) {
	logger.info("Updating feed: %s, with data: %j", req.params.id, req.body);
	
	var feed = {
		title: req.body.title,
		rss: req.body.rss
	}

	rssfeeds.edit(req.params.id, feed).then(function(data) {
		res.json(data);
	}, function(err) {
		res.json(err);
	}); 
}

function deleteRSSFeed(req, res) {
	logger.info("removing feed");
	rssfeeds.delete(req.params.id).then(function(data) {
		logger.info("Successfully deleted feed");
		res.json(data);
	}, function(err) {
		logger.error("Error occurred while deleting feed");
		res.json(err);
	});
}