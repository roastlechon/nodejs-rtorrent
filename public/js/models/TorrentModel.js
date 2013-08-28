define([
	"jquery",
	"underscore",
	"backbone"
], function($, _, Backbone) {
	var TorrentModel = Backbone.Model.extend({
		initialize: function() {
		},
		startTorrent: function() {
			$.get("/torrent/start/" + this.get("hash"));
		},
		pauseTorrent: function() {
			$.get("/torrent/pause/" + this.get("hash"));
		},
		stopTorrent: function() {
			$.get("/torrent/stop/" + this.get("hash"));
		},
		removeTorrent: function() {
			$.get("/torrent/remove/" + this.get("hash"));
		}
	});
	return TorrentModel;
});