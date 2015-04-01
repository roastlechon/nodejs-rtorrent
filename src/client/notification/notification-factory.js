function Notification($q, $timeout) {

	var Notification = {};

	Notification.notifications = [];

	Notification.add = function (type, message, isHtml) {
		var deferred = $q.defer();

		var notification = {
			type: type,
			msg: message,
      isHtml: isHtml
		};

		Notification.notifications.push(notification);

    // dont add timeout to remove notification if it has
    // html. this means that the notification has an action that
    // the user can act on and cannot be dismissed until the user
    // has acted on it.
    if (!notification.isHtml) {
      // need to add animation
      $timeout(function () {
        Notification.notifications.splice(0, 1);
      }, 3000);
    }


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
