module.exports = function(app) {
	app.post("/add", index);
}

var urllib = require("urllib");
var fs = require("fs");
var path = require('path')
var crypto = require('crypto');
var rtorrent = require('../lib/rtorrent');

var loadTorrentUrl = function(url) {
	rtorrent.loadTorrentUrl(url, function(err, val) {
		console.log(val);
	});
}

function index(req, res) {
	console.log(req.body);
	var url = req.body.torrentUrl;
	loadTorrentUrl(url);
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

	
	res.send("ok");
}