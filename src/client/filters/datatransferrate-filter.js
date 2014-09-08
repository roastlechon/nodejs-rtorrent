module.exports = angular.module('app')
	.filter('dataTransferRate', function() {
		return function(dataTransferRate, precision) {
			if (isNaN(parseFloat(dataTransferRate)) || !isFinite(dataTransferRate)) return '-';
			if (dataTransferRate === 0) return '-';
			if (typeof precision === 'undefined') precision = 1;
			var units = ['bytes/s', 'kB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s'],
				number = Math.floor(Math.log(dataTransferRate) / Math.log(1024));
			return (dataTransferRate / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
		}
	});