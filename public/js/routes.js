define([
	"angular",
	"app",
	"services/AuthenticationInterceptor",
	"services/AuthenticationFactory"
], function(angular, app) {
	"use strict";
	return app.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider",
		function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
			console.log("doing stuff");
			
			$stateProvider.state("torrents", {
				url: "/torrents",
				templateUrl: "../partials/torrents.html",
				controller: "TorrentsController",
				data: {
					rule: ["isLoggedIn"]
				}
			});

			$stateProvider.state("feeds", {
				url: "/feeds",
				templateUrl: "../partials/feeds.html",
				controller: "FeedsController",
				data: {
					rule: ["isLoggedIn"]
				}
			});

			$stateProvider.state("add_feed", {
				url: "/feeds/add",
				templateUrl: "../partials/add_feed.html",
				controller: "FeedsController",
				data: {
					rule: ["isLoggedIn"]
				}
			});

			$stateProvider.state("edit_feed", {
				url: "/feeds/:id/edit",
				templateUrl: "../partials/edit_feed.html",
				controller: "EditFeedController",
				data: {
					rule: ["isLoggedIn"]
				}
			});

			$stateProvider.state("feed", {
				url: "/feeds/:id",
				templateUrl: "../partials/feeds_torrents.html",
				controller: "FeedController",
				data: {
					rule: ["isLoggedIn"]
				}
			});

			$stateProvider.state("search", {
				url: "/search",
				templateUrl: "../partials/search.html",
				controller: "SearchController",
				data: {
					rule: ["isLoggedIn"]
				}
			});

			$stateProvider.state("settings", {
				url: "/settings",
				templateUrl: "../partials/settings.html",
				controller: "SettingsController",
				data: {
					rule: ["isLoggedIn"]
				}
			});

			$stateProvider.state("login", {
				url: "/login",
				templateUrl: "../partials/login.html",
				controller: "LoginController"
			});

			$urlRouterProvider.when("/logout", "/login").when("/", "torrents");

			$httpProvider.interceptors.push("AuthenticationInterceptor");
		}
	]).run(function($rootScope, AuthenticationFactory, $state) {
		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
			console.log("state change start event");
			if (!toState.data) {
				console.log("doesnt have data")
				return;
			}

			if (toState.data.rule.indexOf("isLoggedIn") !== -1) {
				console.log("has isloggedin");
				if (!AuthenticationFactory.isAuthenticated()) {
					$state.go("login");
					event.preventDefault();
				}
			}
		});

		$rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
			console.log("state change success");
			console.log(toState);
			console.log(fromState);
			// if (fromState.name === "login") {
			// 	event.preventDefault();
			// 	$state.go(toState(""))
			// }
		});
	});
});