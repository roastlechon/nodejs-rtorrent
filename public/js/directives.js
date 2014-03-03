define([
	"angular",
	"services"
], function(angular, services) {
	"use strict";

	return angular.module("nodejs-rtorrent.directives", ["nodejs-rtorrent.services"]).value("version", "0.1");
});