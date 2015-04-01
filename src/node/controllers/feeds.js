var feeds = require('../models/feeds');
var logger = require('winston');
var auth = require('../auth/auth');
var Q = require('q');

module.exports = function(app) {
	app.get('/feeds', getFeeds);
	app.get('/feeds/:id', getFeed);
	app.post('/feeds', addFeed);
	app.put('/feeds/:id', updateFeed);
	app.delete('/feeds/:id', deleteFeed);
	app.post('/feeds/test', testFeed);
	app.post('/feeds/:id/refresh', refreshFeed);
}

function getFeed(req, res) {
	logger.info('Getting feed', req.params.id);

	feeds.get(req.params.id).then(function(data) {
		logger.info('Successfully retrieved rss feed', data._id);
		res.json(data);
	}, function(err) {
		logger.error(err.message);
		res.status(500).send(err.message);
	});
}

function getFeeds(req, res) {
	feeds.getAll().then(function(data) {
		logger.info('Successfully retrieved rss feeds');
		res.json(data);
	}, function(err) {
		logger.error(err.message);
		res.status(500).send(err.message);
	});
}

function addFeed(req, res) {
	logger.info('Adding feed', req.body.rss);

	feeds.add(req.body).then(function(data) {
		logger.info('Successfully saved feed.');
		res.json(data);
	}, function(err) {
		console.log(err);
		logger.error(err.message);
		res.status(500).send(err.message);
	});
}


function updateFeed(req, res) {
	logger.info('Updating feed', req.params.id);

	feeds.edit({
		_id: req.params.id,
		title: req.body.title,
		path: req.body.path,
		changeTorrentLocation: req.body.changeTorrentLocation,
		autoDownload: req.body.autoDownload,
		regexFilter: req.body.regexFilter,
		filters: req.body.filters
	}).then(function(data) {
		res.json(data);
	}, function(err) {
		logger.error(err.message);
		res.status(500).send(err.message);
	}); 
}

function deleteFeed(req, res) {
	logger.info('Removing feed', req.params.id);
	feeds.deleteFeed(req.params.id).then(function(data) {
		logger.info('Successfully deleted feed');
		res.json(data);
	}, function(err) {
		logger.error(err.message);
		res.status(500).send(err);
	});
}

function refreshFeed (req, res) {
	logger.info('Refreshing feed', req.params.id);
	feeds.refreshFeed(req.params.id).then(function (data) {
		logger.info('Successfully refreshed feed');
		res.json(data);
	}, function (err) {
		logger.error(err.message);
		req.status(500).send(err);
	});
}

function testFeed (req, res) {
	logger.info('Testing Feed');
	// feeds.test()
}