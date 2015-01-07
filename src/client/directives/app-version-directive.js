'use strict';

function appVersion ($document) {
	return function (scope, element) {
		element.html($document[0].documentElement.getAttribute('version'));
	};
}

module.exports = angular
	.module('app')
	.directive('appVersion', ['$document', appVersion]);