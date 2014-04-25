define([
	"angular",
	"filters",
	"services",
	"directives/index",
	"controllers/index",
	"angularUpload",
	"angularUiRouter",
	"uiBootstrap",
	"restangular"
], function(angular) {
	"use strict";

	return angular.module("app", [
		"ui.bootstrap",
		"lr.upload",
		"ui.router",
		"restangular",
		"nodejs-rtorrent.services",
		"nodejs-rtorrent.controllers",
		"nodejs-rtorrent.filters",
		"nodejs-rtorrent.directives"
	]);
});