
var notifications = [];

function add(notification) {
	notifications.push(notification);
}

module.exports = {
	list: notifications,
	add: add
};