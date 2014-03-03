define([
	"angular",
	"app",
	"services/AuthenticationInterceptor",
	"services/AuthenticationFactory"
], function(angular, app) {
	"use strict";
	return app.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider",
		function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
			$urlRouterProvider.otherwise("/");

			$stateProvider.state("home", {
				url: "/",
				templateUrl: "../partials/index.html",
				controller: "IndexController"
			});
			
			$stateProvider.state("torrents", {
				url: "/torrents",
				templateUrl: "../partials/torrents.html",
				controller: "TorrentsController"
			});

			$stateProvider.state("add_torrent", {
				url: "/torrents/add",
				templateUrl: "../partials/add_torrent.html",
				controller: "TorrentsController"
			});
			
			$stateProvider.state("feeds", {
				url: "/feeds",
				templateUrl: "../partials/feeds.html",
				controller: "FeedsController"
			});

			$stateProvider.state("add_feed", {
				url: "/feeds/add",
				templateUrl: "../partials/add_feed.html",
				controller: "FeedsController"
			});

			$stateProvider.state("edit_feed", {
				url: "/feeds/:id/edit",
				templateUrl: "../partials/edit_feed.html",
				controller: "EditFeedController"
			});

			$stateProvider.state("feed", {
				url: "/feeds/:id",
				templateUrl: "../partials/feeds_torrents.html",
				controller: "FeedController"
			});

			$stateProvider.state("search", {
				url: "/search",
				templateUrl: "../partials/search.html",
				controller: "SearchController"
			});

			$stateProvider.state("settings", {
				url: "/settings",
				templateUrl: "../partials/settings.html",
				controller: "SettingsController"
			});

			$stateProvider.state("login", {
				url: "/login",
				templateUrl: "../partials/login.html",
				controller: "LoginController"
			});

			$urlRouterProvider.when("/logout", "/home")

			$httpProvider.interceptors.push("AuthenticationInterceptor");
		}
	]);
});