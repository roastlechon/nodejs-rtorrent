define([
	"directives"
], function(directives) {
	"use strict"
	directives.directive("actionbar", 
		function() {
			return function(scope, element, attributes) {
				var tableElement = angular.element(element);
				angular.element("#torrents .table").on("click", "tr.torrent", function() {
					angular.element(this).toggleClass("active");
				});
			};
		}
	);
});