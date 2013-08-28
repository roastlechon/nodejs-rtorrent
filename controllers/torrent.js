var urllib = require("urllib");
var fs = require("fs");
var crypto = require("crypto");
var path = require("path");
var rtorrent = require("../lib/rtorrent");
var Zombie = require("zombie");
var logger = require("winston");
var auth = require("./auth.js")

module.exports = function(app, upload) {
	app.get("/torrent/start/:hash", auth.ensureAuthenticated, start);
	app.get("/torrent/stop/:hash", auth.ensureAuthenticated, stop);
	app.get("/torrent/pause/:hash", auth.ensureAuthenticated, pause);
	app.get("/torrent/remove/:hash", auth.ensureAuthenticated, remove);
	app.post("/torrent/addlink", auth.ensureAuthenticated, addlink);
	upload.on("end", uploadfile);
}

function start(req, res) {
	rtorrent.startTorrent(req.params.hash, function(err, val) {
		res.send("success");
	});
}

function stop(req, res) {
	rtorrent.stopTorrent(req.params.hash, function(err, val) {
		res.send("success");
	});
}

function pause(req, res) {
	rtorrent.pauseTorrent(req.params.hash, function(err, val) {
		res.send("success");
	});
}

function remove(req, res) {
	rtorrent.removeTorrent(req.params.hash, function(err, val) {
		res.send("success");
	});
}

function addlink(req, res) {
	rtorrent.loadTorrentUrl(req.body.url, function(err, val) {
		console.log(val);
		res.send("ok");
	});
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