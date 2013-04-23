module.exports = function(app) {
	app.get("/test", index);
}

var urllib = require("urllib");
var fs = require("fs");

function index(req, res) {
	var req = urllib.request("http://www.nyaa.eu/?page=download&tid=425544", {type : "GET"}, function (err, data, res) {
		console.log(res.statusCode);
		console.log(res.headers);
		fs.writeFile("test.torrent", data, function(error) {
			if (error) {
				console.log(error);
			} else {
				console.log("saving success");
			}
		});
	});
}