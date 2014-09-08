module.exports = angular
	.module('home', [
		'ui.router'
	])
	.config(function($stateProvider) {
		$stateProvider.state('home', {
			url: '/',
			views: {
				'home@': {
					templateUrl: 'home/home.tpl.html'
				}
			},
			sticky: true
			// ,
			// data: {
			// 	rule: ['isLoggedIn']
			// }
		});
	});