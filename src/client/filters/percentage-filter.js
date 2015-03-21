angular.module('app')
	.filter('percentage', function() {
		return function(input) {
			var rounded = Math.round(input * 10000) / 100;
			if (rounded == NaN) {
				return '';
			}
			var percentage = '' + rounded + '%';
			return percentage;
		};
	});
