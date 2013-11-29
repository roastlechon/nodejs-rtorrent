define(["angular", "services"], function(angular, services) {
	"use strict";

	angular.module("nodejs-rtorrent.filters", ["nodejs-rtorrent.services"])
		.filter("interpolate", ["version",
			function(version) {
				return function(text) {
					return String(text).replace(/\%VERSION\%/mg, version);
				};
			}
		])
		.filter('bytes', function() {
			return function(bytes, precision) {
				if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
				if (bytes === 0) return '-';
				if (typeof precision === 'undefined') precision = 1;
				var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
				number = Math.floor(Math.log(bytes) / Math.log(1024));
				return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
			}
		})
		.filter('dataTransferRate', function() {
			return function(dataTransferRate, precision) {
				if (isNaN(parseFloat(dataTransferRate)) || !isFinite(dataTransferRate)) return '-';
				if (dataTransferRate === 0) return '-';
				if (typeof precision === 'undefined') precision = 1;
				var units = ['bytes/s', 'kB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s'],
				number = Math.floor(Math.log(dataTransferRate) / Math.log(1024));
				return (dataTransferRate / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
			}
		})
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
			}
		});
});