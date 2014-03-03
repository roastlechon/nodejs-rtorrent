var urllib = require("urllib");
var fs = require("fs");
var crypto = require("crypto");
var path = require("path");
var rtorrent = require("../lib/rtorrent");
var Zombie = require("zombie");
var logger = require("winston");
var auth = require("./auth.js")

module.exports = function(app) {
	app.post("/torrent", auth.ensureAuthenticated, torrentAction);
}

function torrentAction(req, res) {
	var request = {
		hash: req.body.hash,
		action: req.body.action,
		url: req.body.url,
		channel: req.body.channel
	}

	switch (request.action) {
		case "start":
			rtorrent.startTorrent(request.hash).then(function(data) {
				res.send("success");
			}, function(err) {
				logger.error(err);
			});
		break;
		case "stop":
			rtorrent.stopTorrent(request.hash).then(function(data) {
				res.send("success");
			}, function(err) {
				logger.error(err);
			});
		break;
		case "pause":
			rtorrent.pauseTorrent(request.hash).then(function(data) {
				res.send("success");
			}, function(err) {
				logger.error(err);
			});
		break;
		case "remove":
			rtorrent.removeTorrent(request.hash).then(function(data) {
				res.send("success");
			}, function(err) {
				logger.error(err);
			});
		break;
		case "load":
			rtorrent.loadTorrentUrl(request.url).then(function(data) {
				res.send("success");
			}, function(err) {
				logger.error(err);
			});
		break;
		case "setChannel":
			rtorrent.setThrottle(request.hash, request.channel).then(function(data) {
				res.send("success");
			}, function(err) {
				logger.error(err);
			});
		break;
		case "upload":
			rtorrent.loadTorrentFile(req.files.torrentFile.path).then(function(data) {
				res.send("success");
			}, function(err) {
				logger.error(err);
			});
		break;
	}
}