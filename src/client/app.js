require("jquery");
require("angular");
require("angular-ui-bootstrap");
require("angular-ui-router");
require("ui-router-extras");
require("underscore");
require("restangular");

var moment = require("moment");

require("./services");
require("./controllers");
require("./filters");
require("./directives");

angular.module("app", [
	"ui.bootstrap",
	"ui.router",
	"ct.ui.router.extras",
	"restangular",
	"nodejs-rtorrent.services",
	"nodejs-rtorrent.controllers",
	"nodejs-rtorrent.filters",
	"nodejs-rtorrent.directives"
]).config(["$logProvider", "$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", "$stickyStateProvider",
	function($logProvider, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $stickyStateProvider) {
		$stickyStateProvider.enableDebug(true);
		$stateProvider.state("home", {
			url: "/",
			views: {
				'home@': {
					templateUrl: "../partials/index.html"
				}
			},
			sticky: true
		});

		$stateProvider.state("home.torrents", {
			url: "torrents",
			views: {
				'home@': {
					controller: "TorrentsController",
					templateUrl: "../partials/torrents.html",
				}
			},
			data: {
				rule: ["isLoggedIn"]
			}
		});

		$stateProvider.state("home.torrents.add", {
			url: "/add",
			views: {
				'modal@': {
					templateUrl: "../partials/add_torrent_modal.html",
					controller: "AddTorrentController as addtorrent"
				}
			},
			isModal: true
		});

		$stateProvider.state("home.feeds", {
			url: "feeds",
			views: {
				'home@': {
					controller: "FeedsController",
					templateUrl: "../partials/feeds.html",
				}
			},
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
			views: {
				'modal@': {
					templateUrl: '../partials/login_modal.html',
					controller: "LoginController as login"
				}
			},
			isModal: true
		});


		// redirects to torrents
		$urlRouterProvider.otherwise("/");

		// $urlRouterProvider.when("/logout", "/login");

		$httpProvider.interceptors.push("AuthenticationInterceptor");
	}
]).run(["$log", "$rootScope", "AuthenticationFactory", "$state", "$modal", "$previousState",
	function($log, $rootScope, AuthenticationFactory, $state, $modal, $previousState) {

		var stateBehindModal = {};
		var modalInstance = null;

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

			// Implementing "isModal":
			// perform the required action to transitions between "modal states" and "non-modal states".
			//

			if (!fromState.isModal && toState.isModal) {
				//
				// Non-modal state ---> modal state
				//

				stateBehindModal = {
					state: fromState,
					params: fromParams
				};

				$previousState.memo("modalInvoker");

				// Open up modal
				modalInstance = $modal.open({
					template: '<div ui-view="modal"></div>'
				});

				modalInstance.result.finally(function() {
					// Reset instance to mark that the modal has been dismissed.
					modalInstance = null

					// Go to previous state
					$state.go(stateBehindModal.state, stateBehindModal.params);
				});

			} else if (fromState.isModal && !toState.isModal) {
				//
				// Modal state ---> non-modal state
				//

				// Directly return if the instance is already dismissed.
				if (!modalInstance) {
					return;
				}

				// Dismiss the modal, triggering the reset of modalInstance
				modalInstance.dismiss();
			}

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
	}
]);