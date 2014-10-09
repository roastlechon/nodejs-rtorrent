module.exports = angular
	.module('notification')
	.controller('NotificationCtrl', function(njrtLog, Notification, Socket) {

		var logger = njrtLog.getInstance('notification.NotificationCtrl');

		logger.debug('NotificationCtrl loaded.');

		var vm = this;

		vm.Notification = Notification;

		Socket.on('notifications', function (data) {
			Notification.add(data.type, data.message);
		});
	});