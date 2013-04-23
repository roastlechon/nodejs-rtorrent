module.exports = function(app, io) {
	io.sockets.on("connection", function(socket) {
		var getTorrents = function(callback) {
			rtorrent.getAll(function(list) {
				console.log("getting list");
				socket.emit("torrents", list);
			});
			callback();
		}
		
		var continueEmitting = function(){
			setTimeout(function(){
				getTorrents(continueEmitting);
			}, 1000);
		}
		continueEmitting();
	});
	app.get("/", index);
}

var rtorrent = require("../lib/rtorrent");

function index(req, res) {
	console.log("rendering view");
	res.render("index", {
		partials : {
			header : "header",
			footer : "footer"
		},
		page : {
			head : {
				title : "nodejs-rtorrent"
			},
			body : {
				title : "nodejs-rtorrent"
			}
		}
	});
	console.log("finished rendering");
}