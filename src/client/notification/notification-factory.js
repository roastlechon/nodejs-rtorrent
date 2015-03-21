function Notification($q, $timeout) {

	var Notification = {};

	Notification.notifications = [];

	Notification.add = function (type, message) {
		var deferred = $q.defer();

		var notification = {
			type: type,
			msg: message
		};

		Notification.notifications.push(notification);

		// need to add animation
		$timeout(function () {
			Notification.notifications.splice(0, 1);
		}, 3000);

		deferred.resolve(notification);

		return deferred.promise;
	};

	Notification.remove = function (index) {
		Notification.notifications.splice(index, 1);
	};

	return Notification;
}

angular
	.module('njrt.notification')
	.factory('njrt.Notification', ['$q', '$timeout', Notification]);
