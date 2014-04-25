define([
	"services"
], function(serviceModule) {
	"use strict";
	return serviceModule.factory("TorrentFactory", function(Restangular) {
		return {
			playTorrent: function(hash) {
				var torrent = Restangular.one("torrents", hash);
				return torrent.post("start", {});
			},
			pauseTorrent: function(hash) {
				var torrent = Restangular.one("torrents", hash);
				return torrent.post("pause", {});
			},
			stopTorrent: function(hash) {
				var torrent = Restangular.one("torrents", hash);
				return torrent.post("stop", {});
			},
			removeTorrent: function(hash) {
				var torrent = Restangular.one("torrents", hash);
				return torrent.post("remove", {});	
			},
			loadTorrent: function(url) {
				var torrent = Restangular.all("torrents");
				return torrent.customPOST(url, "load");
			}
		};
	});
});