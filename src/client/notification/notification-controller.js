module.exports = angular
	.module('notification')
	.controller('NotificationCtrl', function(njrtLog, Notification) {

		var logger = njrtLog.getInstance('notification.NotificationCtrl');

		logger.debug('NotificationCtrl loaded.');

		var vm = this;

		vm.Notification = Notification;
	});