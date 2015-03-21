angular.module('app')
	.filter('time', function() {
		return function(value) {
			if (isNaN(parseFloat(value)) || !isFinite(value)) return '-';
			var suffix = "s",
				day = 86400,
				hr = 3600,
				min = 60;
			var seconds = parseInt(value, 10);
			var days = Math.floor(seconds / day);
			var hours = Math.floor((seconds - (days * day)) / hr);
			var minutes = Math.floor((seconds - (days * day) - (hours * hr)) / min);
			var seconds = seconds - (days * day) - (hours * hr) - (minutes * min);

			if (value >= min && value <= hr) {
				return [minutes, "m ", seconds, "s"].join("");
			} else if (value >= hr && value <= day) {
				return [hours, "h ", minutes, "m ", seconds, "s"].join("");
			} else if (value >= day) {
				return [days, "d ", hours, "h ", minutes, "m ", seconds, "s"].join("");
			}
		};
	});
