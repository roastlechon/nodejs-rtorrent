function config($urlRouterProvider, $stateProvider, $stickyStateProvider) {
  $stickyStateProvider.enableDebug(true);
  $urlRouterProvider.otherwise('/');
}

angular.module('app', [
	'ui.bootstrap',
	'ui.router',
	'ct.ui.router.extras',
	'angularFileUpload',
	'restangular',
	'angular-inview',
  'njrt.templates',
	'njrt.log',
	'njrt.top',
	'njrt.modal',
	'njrt.notification',
	'njrt.login',
	'njrt.session',
	'njrt.authentication',
	'njrt.socket',
	'njrt.torrents',
	'njrt.feeds',
	'njrt.settings'
]).config(['$urlRouterProvider', '$stateProvider', '$stickyStateProvider', config]);

