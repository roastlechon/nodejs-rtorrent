require.config({
	paths: {
		jquery: "../bower_components/jquery/jquery",
		angular: "../bower_components/angular/angular",
		angularResource: "../bower_components/angular-resource/angular-resource",
		angularUiRouter: "../bower_components/angular-ui-router/release/angular-ui-router",
		angularUpload: "../bower_components/angular-upload/angular-upload.min",
		text: "../bower_components/requirejs-text/text",
		uiBootstrap: "../bower_components/angular-bootstrap/ui-bootstrap-tpls",
		io: "../bower_components/socket.io-client/dist/socket.io",
		lodash: "../bower_components/lodash/dist/lodash",
		restangular: "../bower_components/restangular/dist/restangular",
		moment: "../bower_components/moment/moment"
	},
	baseUrl: "js",
	shim: {
		"angular": {
			deps: ["jquery"],
			"exports": "angular"
		},
		"angularResource": ["angular"],
		"angularUiRouter": ["angular"],
		"angularUpload": ["angular"],
		"uiBootstrap": {
			deps: ["angular"],
			"exports": "uiBootstrap"
		},
		"restangular": {
			deps: [
				"angular",
				"lodash"
			]
		}
	},
	priority: [
		"angular"
	]
});

// hey Angular, we"re bootstrapping manually!
window.name = "NG_DEFER_BOOTSTRAP!";

require([
	"angular",
	"app",
	"routes"
], function(angular, app) {
	"use strict";
	var $html = angular.element(document.getElementsByTagName('html')[0]);

	angular.element().ready(function() {
		angular.resumeBootstrap([app["name"]]);
	});
});