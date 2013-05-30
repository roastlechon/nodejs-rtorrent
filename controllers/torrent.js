module.exports = function(app) {
	app.post("/torrent", index);
}

var rtorrent = require("../lib/rtorrent");

var startTorrent = function(hash) {
	rtorrent.startTorrent(hash, function(err, val) {
		console.log(val);
	});
	rtorrent.resumeTorrent(hash, function(err, val) {
		console.log(val);
	});
}

var stopTorrent = function(hash) {
	rtorrent.stopTorrent(hash, function(err, val) {
		console.log(val);
	});
}

var pauseTorrent = function(hash) {
	rtorrent.pauseTorrent(hash, function(err, val) {
		console.log(val);
	});
}

var removeTorrent = function(hash) {
	rtorrent.removeTorrent(hash, function(err, val) {
		console.log(val);
	});
}

function index(req, res) {
	console.log(req.body);
	var hash = req.body.hash;
	var action = req.body.action;
	if (action === "play") {
		console.log("starting torrent");
		startTorrent(hash);
	} else if (action === "stop") {
		console.log("stopping torrent");
		stopTorrent(hash);
	} else if (action === "pause") {
		console.log("pausing torrent");
		pauseTorrent(hash);
	} else if (action === "delete") {
		console.log("removing torrent");
		removeTorrent(hash);
	}
	res.send("ok");
}