var torrentsModel = require('./torrents-model');

function torrentsQueryListener(query, callback) {
	torrentsModel.query(query)
		.then(function (data) {
			callback(null, data);
		}, function (err) {
			callback(err);
		});
}

function TorrentsSocket(socket) {

	this.socket = socket;

	this.eventHandler = {
		torrentsQuery: torrentsQueryListener
	};

}

// Event handler for torrents
module.exports = TorrentsSocket;
