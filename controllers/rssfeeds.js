var rssfeeds = require("../models/rssfeeds");
var mongoose = require("mongoose");
var logger = require("winston");
var auth = require("./auth.js");

module.exports = function(app) {
	app.get("/rssfeeds", auth.ensureAuthenticated, getRSSFeeds);
	app.get("/rssfeeds/:id", auth.ensureAuthenticated, getRSSFeed);
	app.post("/rssfeeds", auth.ensureAuthenticated, addRSSFeed);
	app.put("/rssfeeds/:id", auth.ensureAuthenticated, updateRSSFeed);
	app.del("/rssfeeds/:id", auth.ensureAuthenticated, deleteRSSFeed);
}

function getRSSFeeds(req, res) {
	logger.info("client's ip address is: %s", req.connection.remoteAddress);
	rssfeeds.getRSSFeeds(function(results, errors) {
		if (errors) {
			logger.error("errors occured in getRSSFeeds");
			logger.error(errors);
			res.json(errors);
		} else {
			logger.info("successfully retrieved rss feeds");
			res.json(results);
		}
	});
}

function addRSSFeed(req, res) {
	logger.info("client's ip address is: %s", req.connection.remoteAddress);

	var feed = {
		title: req.body.title,
		rss: req.body.rss
	};

	//check database if feed exists
	//if feed does not exist, create new feedsub
	//get list of feeds to return to client

	rssfeeds.saveRSSFeed(feed, function(errors, feed) {
		if (errors) {
			logger.error("errors occured in saveRSSFeed");
			logger.error(errors);
			res.json(errors);
		} else {
			logger.info("successfully saved rss feed");
			res.json(feed);
		}
	});
}

function getRSSFeed(req, res) {
	logger.info("client's ip address is: %s", req.connection.remoteAddress);
	logger.info("getting single rss feed: %s", req.params.id);
	rssfeeds.getRSSFeed(req.params.id, function(errors, feed) {
		if (errors) {
			logger.error("errors occured in getRSSFeed");
			logger.error(errors);
			res.json(errors);
		} else {
			logger.info("successfully retrieved rss feed");
			res.json(feed);
		}
	});

}

function updateRSSFeed(req, res) {
	logger.info("client's ip address is: %s", req.connection.remoteAddress);
	logger.info("updating feed: %s %j", req.params.id, req.body);
	var feed = {
		title: req.body.title,
		rss: req.body.rss
	}
	rssfeeds.updateRSSFeed(req.params.id, feed, function(errors, feed) {
		if (errors) {
			logger.error("errors occured in updateRSSFeed");
			logger.error(errors);
			res.json(errors);
		} else {
			logger.info("successfully updated rss feed");
			res.json(feed);
		}
	});
}

function deleteRSSFeed(req, res) {
	logger.info("client's ip address is: %s", req.connection.remoteAddress);
	logger.info("removing feed: %s", req.params.id);
	rssfeeds.deleteFeed(req.params.id, function(errors, results) {
		if (errors) {
			logger.error("error occured deleting feed");
			logger.error(errors);
		} else {
			logger.info("successfully deleted rss feed");
			res.json({});
		}
	});
}