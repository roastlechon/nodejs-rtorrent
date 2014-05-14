define([
	"angular",
	"app",
	"moment",
	"services/AuthenticationInterceptor",
	"services/AuthenticationFactory",
], function(angular, app, moment) {
	"use strict";
	return app.config(["$logProvider", "$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider",
		function($logProvider, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
			
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

			// $stateProvider.state("edit_feed", {
			// 	url: "/feeds/:id/edit",
			// 	templateUrl: "../partials/edit_feed.html",
			// 	controller: "EditFeedController",
			// 	data: {
			// 		rule: ["isLoggedIn"]
			// 	}
			// });

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


			// redirects to torrents
			$urlRouterProvider.otherwise("/torrents");

			$urlRouterProvider.when("/logout", "/login");

			$httpProvider.interceptors.push("AuthenticationInterceptor");
		}
	]).run(["$log", "$rootScope", "AuthenticationFactory", "$state", function($log, $rootScope, AuthenticationFactory, $state) {

		$log.getInstance = function(context) {
			return {
				log: enhanceLogging($log.log, context),
				info: enhanceLogging($log.info, context),
				warn: enhanceLogging($log.warn, context),
				debug: enhanceLogging($log.debug, context),
				error: enhanceLogging($log.error, context)
			};
		}

		function enhanceLogging(logFn, context) {
			return function() {
				var modifiedArguments = [].slice.call(arguments);
				modifiedArguments[0] = [moment().format("dddd h:mm:ss a") + '::[' + context + ']> '] + modifiedArguments[0];
				logFn.apply(null, modifiedArguments);
			};
		}

		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
			if (!toState.data) {
				console.log("State has no data, returning early");
				return;
			}

			if (toState.data.rule.indexOf("isLoggedIn") !== -1) {
				console.log("State has rule: isLoggedIn");
				if (!AuthenticationFactory.isAuthenticated()) {
					$state.go("login");
					event.preventDefault();
				}
			}
		});
	}]);
});
