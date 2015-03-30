var logger = require('winston');



function torrentsQueryListener(query, callback) {
	// var that = this;
	this.torrentsModel.query(query)
		.then(function (data) {
			callback(null, data);
		}, function (err) {
			callback(err);
		});
}

function torrentsAllListener(query, callback) {
	// var that = this;
	// this.torrentsModel.all()
	// 	.then(function (data) {
	// 		callback(null, data);
	// 	}, function (err) {
	// 		callback(err);
	// 	});
}

function torrentsHashesListener(hashes, callback) {
  this.torrentsModel.getTorrentsByHashes(hashes)
    .then(function (data) {
      callback(null, data);
    });
}

function stop() {
	this.torrentsModel.stopLoop();
}

function TorrentsSocket(socket) {

	this.socket = socket;

	this.eventHandler = {
		torrentsQuery: torrentsQueryListener.bind(this),
    torrentsAll: torrentsAllListener.bind(this),
		torrentsHashes: torrentsHashesListener.bind(this)

	};

	// this.stop = stop;
	this.torrentsModel = require('./torrents-model');

	// this.torrentsModel.startLoop();

}

// Event handler for torrents
module.exports = TorrentsSocket;
