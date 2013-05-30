module.exports = function(app, upload) {
	upload.on("end", index);
}

var fs = require("fs");
var crypto = require("crypto");
var path = require("path");
var rtorrent = require("../lib/rtorrent");

var loadTorrentFile = function(filepath) {
	rtorrent.loadTorrentFile(filepath, function(err, val) {
		console.log(val);
	});
}
/*
var urllib = require("urllib");
var fs = require("fs");

var crypto = require('crypto');
var rtorrent = require('../lib/rtorrent');

function index(req, res) {
	console.log(req.body);
	var url = req.body.torrentUrl;
	loadTorrentUrl(url);
*/
	/*
	var req = urllib.request(url, {type : "GET"}, function (err, data, response) {
		var md5 = crypto.createHash('md5');
		var filename = path.join('./tmp', md5.update(data).digest('hex') + '.torrent');
		console.log(response.statusCode);
		console.log(response.headers);
		fs.writeFile(filename, data, function(error) {
			if (error) {
				console.log(error);
			} else {
				console.log("saving success");
			}
		});
	});*/

/*	
	res.send("ok");
}
*/

function index(fileinfo) {
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
			loadTorrentFile(newpath);
			console.log(fileinfo);
			console.log("saving success");
		}
	});
}