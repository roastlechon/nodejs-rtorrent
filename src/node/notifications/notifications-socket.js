var logger = require('winston');
var notificationsModel = require('./notifications-model');

var interval;

function notifications(socket) {
	timeout = setInterval(function () {
		if (notificationsModel.list.length > 0) {
			socket.emit('notifications', notificationsModel.list.pop());
		}
	}, 1000);
}

function stop() {
	clearInterval(interval);
}

module.exports = function (socket) {

	this.socket = socket;
	this.stop = stop;

	notifications(this.socket);

};