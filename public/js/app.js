define([
	"angular",
	"filters",
	"services",
	"directives/index",
	"controllers/index",
	"angularUpload",
	"angularUiRouter",
	"uiBootstrap",
	"angularCookies"
], function(angular) {
	"use strict";

	return angular.module("app", [
		"ngCookies",
		"ui.bootstrap",
		"lr.upload",
		"ui.router",
		"nodejs-rtorrent.services",
		"nodejs-rtorrent.controllers",
		"nodejs-rtorrent.filters",
		"nodejs-rtorrent.directives"
	]);
});