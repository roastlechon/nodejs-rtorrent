define([
	"controllers",
	"services/SocketFactory",
	"services/TorrentFactory"
], function(controllers) {
	"use strict";
	controllers.controller("TorrentsController", ["$scope", "SocketFactory", "TorrentFactory",
		function($scope, SocketFactory, TorrentFactory) {
			$scope.predicate = "name";
			$scope.reverse = false;

			$scope.totalItems = 0;
			$scope.currentPage = 1;
			$scope.itemsPerPage = 10;

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

			$scope.playTorrent = function(torrent) {
				console.log("starting torrent");
				TorrentFactory.action({
					action: "start",
					hash: torrent.hash
				}, function(res) {
					console.log("successful response");
					console.log(res);
				}, function(err) {
					console.log("error occured");
					console.log(err);
				});
			}

			$scope.pauseTorrent = function(torrent) {
				console.log("pausing torrent");
				TorrentFactory.action({
					action: "pause",
					hash: torrent.hash
				}, function(res) {
					console.log("successful response");
					console.log(res);
				}, function(err) {
					console.log("error occured");
					console.log(err);
				});
			}

			$scope.stopTorrent = function(torrent) {
				console.log("stop torrent");
				TorrentFactory.action({
					action: "stop",
					hash: torrent.hash
				}, function(res) {
					console.log("successful response");
					console.log(res);
				}, function(err) {
					console.log("error occured");
					console.log(err);
				});
			}

			$scope.loadTorrent = function() {
				console.log("loading torrent");
				TorrentFactory.action({
					action: "load",
					url: $scope.torrentUrl
				}, function(res) {
					console.log("successful response");
					console.log(res);
				}, function(err) {
					console.log("error occured");
					console.log(err);
				});
			}

			$scope.removeTorrent = function(torrent) {
				console.log("removing torrent");
				TorrentFactory.action({
					action: "remove",
					hash: torrent.hash
				}, function(res) {
					console.log("successful response");
					console.log(res);
				}, function(err) {
					console.log("error occured");
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