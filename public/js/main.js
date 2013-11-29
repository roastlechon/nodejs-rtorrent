require.config({
	paths: {
		angular: "../bower_components/angular/angular",
		angularCookies: "../bower_components/angular-cookies/angular-cookies",
		angularResource: "../bower_components/angular-resource/angular-resource",
		angularUiRouter: "../bower_components/angular-ui-router/release/angular-ui-router",
		angularMocks: "../bower_components/angular-mocks/angular-mocks",
		text: "../bower_components/requirejs-text/text",
		uiBootstrap: "../bower_components/angular-bootstrap/ui-bootstrap-tpls",
		io: "../bower_components/socket.io-client/dist/socket.io"
	},
	baseUrl: "js",
	shim: {
		"angular": {
			"exports": "angular"
		},
		"angularResource": ["angular"],
		"angularCookies": ["angular"],
		"angularUiRouter": ["angular"],
		"angularMocks": {
			deps: ["angular"],
			"exports": "angular.mock"
		},
		"uiBootstrap": {
			"exports": "uiBootstrap"
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
], function(angular, app, routes) {
	"use strict";
	var $html = angular.element(document.getElementsByTagName("html")[0]);

	angular.element().ready(function() {
		$html.addClass("ng-app");
		angular.bootstrap($html, [app["name"]]);
	});
});