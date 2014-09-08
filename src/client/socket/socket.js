var log = require('../log/log');

module.exports = angular
	.module('socket', [
		log.name
	]);

require('./socket-factory');