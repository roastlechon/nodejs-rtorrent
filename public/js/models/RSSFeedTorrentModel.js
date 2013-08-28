define([
	"jquery",
	"underscore",
	"backbone"
], function($, _, Backbone) {
	var RSSFeedTorrentModel = Backbone.Model.extend({
		initialize: function() {
			console.log("created torrent model for rss feed");
		},
		loadTorrent: function() {
			console.log("loading torrent: " + this.get("url"));
			$.ajax({
				url: "/torrent/addlink",
				type: "POST",
				dataType: "json",
				data: { url: this.get("url") }
			});
		},
		markLoaded: function() {
			console.log("changing status to loaded: " + this.get("name"));
		}
	});
	
	return RSSFeedTorrentModel;
});