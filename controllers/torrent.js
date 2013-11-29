var urllib = require("urllib");
var fs = require("fs");
var crypto = require("crypto");
var path = require("path");
var rtorrent = require("../lib/rtorrent");
var Zombie = require("zombie");
var logger = require("winston");
var auth = require("./auth.js")

module.exports = function(app, upload) {
	app.post("/torrent", auth.ensureAuthenticated, torrentAction);
	upload.on("end", uploadfile);
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
			rtorrent.startTorrent(request.hash, function(err, val) {
				res.send("success");
			});
		break;
		case "stop":
			rtorrent.stopTorrent(request.hash, function(err, val) {
				res.send("success");
			});
		break;
		case "pause":
			rtorrent.pauseTorrent(request.hash, function(err, val) {
				res.send("success");
			});
		break;
		case "remove":
			rtorrent.removeTorrent(request.hash, function(err, val) {
				res.send("success");
			});
		break;
		case "load":
			rtorrent.loadTorrentUrl(request.url, function(err, val) {
				console.log(val);
				res.send("success");
			});
		break;
		case "setChannel":
			rtorrent.setThrottle(request.hash, request.channel, function(err, val) {
				console.log(request.channel);
				res.send("success");
			});
		break;
	}
}

function uploadfile(fileinfo) {
	var md5 = crypto.createHash('md5')
	var filepath = "/home/roastlechon/nodejs-rtorrent/public/uploads";
	console.log(filepath);
	var oldpath = path.join(filepath, fileinfo.name);
	var filename = path.basename(filepath, ".torrent");
    var newpath = path.join(filepath, md5.update(filename).digest("hex") + ".torrent");
	
	fs.rename(oldpath, newpath, function(error) {
		if (error) {
			console.log(error);
		} else {
			rtorrent.loadTorrentFile(newpath, function(err, val) {
				console.log(val);
				console.log("saving success");
			});
		}
	});
}