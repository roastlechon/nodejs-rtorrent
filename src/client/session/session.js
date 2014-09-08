var log = require('../log/log');

module.exports = angular
	.module('session', [
		log.name
	]);

require('./session-service');