function config($urlRouterProvider, $stateProvider, $stickyStateProvider, $translateProvider) {
  $stickyStateProvider.enableDebug(true);
  $urlRouterProvider.otherwise('/');
  
  $translateProvider.useLocalStorage();
  $translateProvider.useStaticFilesLoader({
    prefix: 'languages/',
    suffix: '.json'
  });
  $translateProvider.preferredLanguage('en');
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
	'njrt.settings',
	'ngCookies',
	'pascalprecht.translate'
]).config(['$urlRouterProvider', '$stateProvider', '$stickyStateProvider', '$translateProvider', config]);

