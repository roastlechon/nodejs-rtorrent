define(["angular", "services"], function(angular, services) {
	"use strict";

	angular.module("nodejs-rtorrent.directives", ["nodejs-rtorrent.services"])
		.directive("appVersion", ["version",
			function(version) {
				return function(scope, elm, attrs) {
					elm.text(version);
				};
			}
		]);
});