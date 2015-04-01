'use strict';

function config ($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.when('/', '/torrents');
	
	$stateProvider.state('top', {
		url: '/',
		views: {
			'top@': {
				templateUrl: 'top/top.tpl.html'
			}
		},
		sticky: true
	});



}

module.exports = angular
	.module('njrt.top', [])
	.config(['$stateProvider', '$urlRouterProvider', config]);