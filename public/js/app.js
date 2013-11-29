define([
	"angular",
	"filters",
	"services",
	"directives",
	"controllers/index",
	"angularUiRouter",
	"uiBootstrap",
	"angularCookies"
], function(angular) {
	"use strict";

	return angular.module("app", [
		"ngCookies",
		"ui.bootstrap",
		"ui.router",
		"nodejs-rtorrent.services",
		"nodejs-rtorrent.controllers",
		"nodejs-rtorrent.filters",
		"nodejs-rtorrent.directives"
	]);
});