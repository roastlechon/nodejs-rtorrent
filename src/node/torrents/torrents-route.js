var logger = require('winston');
var rtorrent = require('../lib/rtorrent');
var auth = require('../auth/auth');

function start(req, res, next) {
	rtorrent.startTorrent(req.params.hash).then(function(data) {
		logger.info('Successfully started torrent', req.params.hash);
		res.json(data);
	}, function(err) {
		next(err);
	});
}

function pause(req, res, next) {
	rtorrent.pauseTorrent(req.params.hash).then(function(data) {
		logger.info('Successfully paused torrent', req.params.hash);
		res.json(data);
	}, function(err) {
		next(err);
	});
}

function stop(req, res, next) {
	rtorrent.stopTorrent(req.params.hash).then(function(data) {
		logger.info('Successfully stopped torrent', req.params.hash);
		res.json(data);
	}, function(err) {
		next(err);
	});
}

function remove(req, res, next) {
	rtorrent.removeTorrent(req.params.hash).then(function(data) {
		logger.info('Successfully removed torrent', req.params.hash);
		res.json(data);
	}, function(err) {
		next(err);
	});
}

function deleteData(req, res, next) {
	rtorrent.deleteTorrentData(req.params.hash).then(function(data) {
		logger.info('Successfully deleted torrent with data', req.params.hash);
		res.json(data);
	}, function (err) {
		next(err);
	});
}

function load(req, res, next) {
	var torrent = {
		url: req.body.url
	};

	if (req.files) {
		torrent.url = req.files.file.path;
	}

	if (req.body.path) {
		torrent.path = req.body.path;
	}

	rtorrent.loadTorrent(torrent)
		.then(function(data) {
			logger.info('Successfully loaded torrent', torrent.url);
			res.json(data);
		}, function(err) {
			next(err);
		});
}

function channel(req, res, next) {
	rtorrent.setThrottle(req.params.hash, req.channel).then(function(data) {
		logger.info('Successfully throttled torrent', req.params.hash, 'with channel', req.channel);
		res.json(data);
	}, function(err) {
		next(err);
	});
}

module.exports = function (router) {
	router.route('/torrents/:hash/start')
		.post(start);
	router.route('/torrents/:hash/pause')
		.post(pause);
	router.route('/torrents/:hash/stop')
		.post(stop);
	router.route('/torrents/:hash/remove')
		.post(remove);
	router.route('/torrents/:hash/delete-data')
		.post(deleteData);
	router.route('/torrents/load')
		.post(load);
	router.route('/torrents/:hash/channel')
		.post(channel);
};
