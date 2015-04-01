var rtorrent = require("../lib/rtorrent");
var logger = require("winston");
var auth = require("../auth/auth")

module.exports = function(app) {
	app.post("/torrents/:hash/start", startTorrent);
	app.post("/torrents/:hash/pause", pauseTorrent);
	app.post("/torrents/:hash/stop", stopTorrent);
	app.post("/torrents/:hash/remove", removeTorrent);
	app.post("/torrents/:hash/delete_data", deleteTorrentData);
	app.post("/torrents/load", loadTorrent);
	app.post("/torrents/:hash/channel", setTorrentChannel);
}

function startTorrent(req, res) {
	rtorrent.startTorrent(req.params.hash).then(function(data) {
		logger.info('Successfully started torrent', req.params.hash);
		res.json(data);
	}, function(err) {
		logger.error(err.message);
		res.status(500).send(err.message);
	});
}

function pauseTorrent(req, res) {
	rtorrent.pauseTorrent(req.params.hash).then(function(data) {
		logger.info('Successfully paused torrent', req.params.hash);
		res.json(data);
	}, function(err) {
		logger.error(err.message);
		res.status(500).send(err.message);
	});
}

function stopTorrent(req, res) {
	rtorrent.stopTorrent(req.params.hash).then(function(data) {
		logger.info('Successfully stopped torrent', req.params.hash);
		res.json(data);
	}, function(err) {
		logger.error(err.message);
		res.status(500).send(err.message);
	});
}

function removeTorrent(req, res) {
	rtorrent.removeTorrent(req.params.hash).then(function(data) {
		logger.info('Successfully removed torrent', req.params.hash);
		res.json(data);
	}, function(err) {
		logger.error(err.message);
		res.status(500).send(err.message);
	});
}

function deleteTorrentData(req, res) {
	rtorrent.deleteTorrentData(req.params.hash).then(function(data) {
		logger.info('Successfully deleted torrent with data', req.params.hash);
		res.json(data);
	}, function (err) {
		logger.error(err.message);
		res.status(500).send(err.message);
	});
}

function loadTorrent(req, res) {
	var torrent = {};

	if (req.files) {
		torrent.url = req.files.file.path;
	} else {
		torrent.url = req.body.url;
	}

	if (req.body.path) {
		torrent.path = req.body.path;
	}

	rtorrent.loadTorrent(torrent)
		.then(function(data) {
			logger.info('Successfully loaded torrent', torrent.url);
			res.json(data);
		}, function(err) {
			logger.error(err.message);
			res.status(500).send(err.message);
		});
}

function setTorrentChannel(req, res) {
	rtorrent.setThrottle(req.params.hash, req.channel).then(function(data) {
		logger.info('Successfully throttled torrent', req.params.hash, 'with channel', req.channel);
		res.json(data);
	}, function(err) {
		logger.error(err.message);
		res.status(500).send(err.message);
	});
}

function uploadTorrent(req, res) {
	rtorrent.loadTorrentFile(req.files.torrentFile.path).then(function(data) {
		res.json(data);
	}, function(err) {
		logger.error(err);
		res.send(err);
	});
}
