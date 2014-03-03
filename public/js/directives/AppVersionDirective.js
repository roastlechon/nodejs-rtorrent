define([
	"directives"
], function(directives) {
	"use strict"
	directives.directive("appVersion", ["version",
		function(version) {
			return function(scope, element, attributes) {
				element.text(version);
			};
		}
	]);
});