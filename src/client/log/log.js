var moment = require('moment');

module.exports = angular
	.module('njrt.log', [])
	.run(['$log', function ($log) {
		$log.getInstance = function(context) {
			return {
				log: enhanceLogging($log.log, context),
				info: enhanceLogging($log.info, context),
				warn: enhanceLogging($log.warn, context),
				debug: enhanceLogging($log.debug, context),
				error: enhanceLogging($log.error, context)
			};
		}

		function enhanceLogging(logFn, context) {
			return function() {
				var modifiedArguments = [].slice.call(arguments);
				modifiedArguments[0] = [moment().format("dddd h:mm:ss a") + '::[' + context + ']> '] + modifiedArguments[0];
				logFn.apply(null, modifiedArguments);
			};
		}
	}])
	.service('njrtLog', function($log) {
		this.getInstance = function(context) {
			return $log.getInstance(context);
		}
	});