function config($stateProvider, $urlRouterProvider) {

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

angular
	.module('njrt.top', [])
	.config(['$stateProvider', '$urlRouterProvider', config]);
