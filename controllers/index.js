var rtorrent = require("../lib/rtorrent");

module.exports = function(app, io) {
	io.sockets.on("connection", function(socket) {
		var getTorrents = function(callback) {
			rtorrent.getAll(function(list) {
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
		socket.on("get total seeds for hash", function(data) {
			rtorrent.getTotalSeeds(data, function(err, list) {
				var value = list.reduce(
					function(a, b) {
		  				return a + b;
					}, 0);
				socket.emit('total seeds', 
					{ total_seeds : value, hash : data });
			});
		});
		socket.on("get total peers for hash", function(data) {
			rtorrent.getTotalPeers(data, function(err, list) {
				var value = list.reduce(
					function(a, b) {
		  				return a + b;
					}, 0);
				socket.emit('total peers', { total_peers : value, hash : data });
			});
		});
	});
	app.get("/", index);
}

function index(req, res) {
	console.log("rendering view");
	rtorrent.getNetworkListenPort(function(err, port) {
		rtorrent.getPortStatus(port, function(err, status) {
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
						title : "nodejs-rtorrent",
						rtorrent_port : port,
						rtorrent_port_status : status
					}
				}
			});
		});
	});
	console.log("finished rendering");
}