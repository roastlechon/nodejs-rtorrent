function appVersion($document) {
	return function (scope, element) {
		element.html($document[0].documentElement.getAttribute('version'));
	};
}

angular
	.module('app')
	.directive('appVersion', ['$document', appVersion]);
