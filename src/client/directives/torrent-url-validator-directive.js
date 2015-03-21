function torrentUrlValidator() {
	return {
		restrict: 'A',
		require:'ngModel',
		link: function ($scope, elem, attrs, ngModel) {
			ngModel.$validators.torrentUrl = function (modelValue, viewValue) {
				var value = modelValue || viewValue;
				return /^https?:/.test(value) || /^magnet:/.test(value);
			}
		}
	};
}

angular
	.module('app')
	.directive('torrentUrlValidator', [torrentUrlValidator]);
