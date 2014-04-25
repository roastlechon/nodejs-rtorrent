define([
	"controllers",
	"services/SocketFactory",
	"services/TorrentFactory",
	"services/MultiClickService",
], function(controllers) {
	"use strict";
	controllers.controller("TorrentsController", ["$log", "$scope", "SocketFactory", "TorrentFactory", "MultiClickService", "$modal",
		function($log, $scope, SocketFactory, TorrentFactory, MultiClickService, $modal) {
			$scope.pageTitle = "Torrents";

			$scope.predicate = "name";
			$scope.reverse = false;

			$scope.status = "";

			$scope.$watch("status", function(newVal, oldVal, scope) {
				if (newVal) {
					console.log("resetSelectedList");
					MultiClickService.resetSelectedList();
					$scope.torrents_selected = MultiClickService.getSelectedList().length;
				}
			});

			$scope.totalItems = 0;
			$scope.currentPage = 1;
			$scope.itemsPerPage = 10;

			// for selected items;
			$scope.torrents_selected = 0;

			$scope.setPage = function (pageNo) {
				$scope.currentPage = pageNo;
			};

			console.log("torrents controller loaded");

			SocketFactory.on("connect", function() {
				console.log("connected to socket");
			});

			SocketFactory.on("connecting", function() {
				console.log("trying to connect");
			});

			SocketFactory.on("connect_failed", function() {
				console.log("connect failed");
			});

			SocketFactory.on("torrents", function(torrents) {
				$scope.torrents = torrents;
				$scope.totalItems = torrents.length;
			});

			$scope.selectTorrent = function(torrent) {
				MultiClickService.toggleItem(torrent);
				$scope.torrents_selected = MultiClickService.getSelectedList().length;
			}

			$scope.playTorrent = function(torrent) {
				console.log("starting torrent");
				TorrentFactory.playTorrent(torrent.hash).then(function(data) {
					console.log(data);
				}, function(err) {
					console.log(err);
				});
			}

			$scope.pauseTorrent = function(torrent) {
				console.log("pausing torrent");
				TorrentFactory.pauseTorrent(torrent.hash).then(function(data) {
					console.log(data);
				}, function(err) {
					console.log(err);
				});
			}

			$scope.stopTorrent = function(torrent) {
				console.log("stop torrent");
				TorrentFactory.stopTorrent(torrent.hash).then(function(data) {
					console.log(data);
				}, function(err) {
					console.log(err);
				});
			}

			$scope.addTorrent = function() {
				$modal.open({
					templateUrl: "../partials/add_torrent_modal.html",
					controller: function($scope, $modalInstance) {
						$scope.torrent = {};
						$scope.loadTorrent = function() {
							console.log($scope.torrent.url);
							$scope.$close($scope.torrent.url);
						}

						$scope.cancel = function() {
							$scope.$dismiss("cancel");
						}
					}
				}).result.then(function(data) {
					TorrentFactory.loadTorrent({
						"url": data
					}).then(function(data) {
						$log.debug(data);
					}, function(err) {
						console.log(err);
					});
				}, function(err) {
					$log.error(err);
				});


				console.log("loading torrent");
				
			}

			$scope.cancelLoadTorrent = function() {
				$scope.$dismiss();
			}

			$scope.removeTorrent = function(torrent) {
				console.log("removing torrent");
				TorrentFactory.removeTorrent(torrent.hash).then(function(data) {
					console.log(data);
				}, function(err) {
					console.log(err);
				});
			}

			$scope.setChannel = function(hash, channel) {
				console.log("setting channel");
				TorrentFactory.action({
					action: "setChannel",
					hash: hash,
					channel: channel
				}, function(res) {
					console.log("successful response");
					console.log(res);
				}, function(err) {
					console.log("error occured");
					console.log(err);
				});
			}

			// size of list
			// size of page
			// number of pages


		}
	]);
});