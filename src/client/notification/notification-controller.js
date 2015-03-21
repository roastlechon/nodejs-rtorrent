function NotificationCtrl(njrtLog, Notification, Socket) {

	var logger = njrtLog.getInstance('njrt.notification');

	logger.debug('NotificationCtrl loaded.');

	var vm = this;

	vm.Notification = Notification;

	Socket.on('notifications', function (data) {
		Notification.add(data.type, data.message);
	});
}

angular
	.module('njrt.notification')
	.controller('njrt.NotificationCtrl', ['njrtLog', 'njrt.Notification', 'Socket', NotificationCtrl]);
