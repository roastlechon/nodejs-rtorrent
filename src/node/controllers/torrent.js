var rtorrent = require("../lib/rtorrent");
var logger = require("winston");
var auth = require("./auth.js")

module.exports = function(app) {
	app.post("/torrents/:hash/start", auth.ensureAuthenticated, startTorrent);
	app.post("/torrents/:hash/pause", auth.ensureAuthenticated, pauseTorrent);
	app.post("/torrents/:hash/stop", auth.ensureAuthenticated, stopTorrent);
	app.post("/torrents/:hash/remove", auth.ensureAuthenticated, removeTorrent);
	app.post("/torrents/load", auth.ensureAuthenticated, loadTorrent);
	app.post("/torrents/:hash/channel", auth.ensureAuthenticated, setTorrentChannel);
}

function startTorrent(req, res) {
	rtorrent.startTorrent(req.params.hash).then(function(data) {
		res.send("success");
	}, function(err) {
		logger.error(err);
		res.send(err);
	});
}

function pauseTorrent(req, res) {
	rtorrent.pauseTorrent(req.params.hash).then(function(data) {
		res.send("success");
	}, function(err) {
		logger.error(err);
		res.send(err);
	});
}

function stopTorrent(req, res) {
	rtorrent.stopTorrent(req.params.hash).then(function(data) {
		res.send("success");
	}, function(err) {
		logger.error(err);
		res.send(err);
	});
}

function removeTorrent(req, res) {
	rtorrent.removeTorrent(req.params.hash).then(function(data) {
		res.send("success");
	}, function(err) {
		logger.error(err);
		res.send(err);
	});
}

function deleteTorrentData(req, res) {
	
}

function loadTorrent(req, res) {
	rtorrent.loadTorrentUrl(req.body.url).then(function(data) {
		res.send("success");
	}, function(err) {
		logger.error(err);
		res.send(err);
	});
}

function setTorrentChannel(req, res) {
	rtorrent.setThrottle(req.params.hash, req.channel).then(function(data) {
		res.send("success");
	}, function(err) {
		logger.error(err);
		res.send(err);
	});
}

function uploadTorrent(req, res) {
	rtorrent.loadTorrentFile(req.files.torrentFile.path).then(function(data) {
		res.send("success");
	}, function(err) {
		logger.error(err);
		res.send(err);
	});
}
