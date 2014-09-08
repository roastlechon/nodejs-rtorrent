module.exports = angular
	.module('app')
	.directive('resize', ['$window',
		function($window) {
			return function(scope, element) {
				var w = angular.element($window);
				scope.$watch(function() {
					return {
						'h': w.height()
					}
				}, function(newValue, oldValue) {
					scope.style = function() {
						return {
							'height': newValue.h - element.offset().top + 'px'
						}
					}
				}, true);

				w.bind('resize', function() {
					scope.$apply();
				});
			};
		}
	]);