function config ($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.when('/settings', '/settings/download');

	$stateProvider
		.state('settings', {
			url: '/settings',
			views: {
				'modal@': {
					templateUrl: 'settings/settings.tpl.html',
					controller: 'njrt.SettingsCtrl as settingsCtrl'
				}
			},
			data: {
				rule: ['isLoggedIn']
			},
			isModal: true,
			modalSize: 'lg'
		});
}

angular
	.module('njrt.settings', [
		'njrt.settings.connectionSettings',
    'njrt.settings.downloadSettings'
	])
	.config(['$stateProvider', '$urlRouterProvider', config]);
