define([
	"jquery",
	"underscore",
	"backbone",
	"mustache",
	"text!templates/rssfeed_torrent.html"
], function($, _, Backbone, Mustache, rssfeed_torrent) {
	var RSSFeedTorrentView = Backbone.View.extend({
		tagName: "li",
		className: "list-unstyled",
		events: {
			"click .load-torrent": "loadTorrent",
			"click .mark-loaded": "markLoaded"
		},
		initialize: function() {
			console.log("creating torrent view for rss feed");
		},
		render: function() {
			this.$el.html(Mustache.to_html(rssfeed_torrent, this.model.toJSON()));
			return this;
		},
		loadTorrent: function() {
			this.model.loadTorrent();
		},
		markLoaded: function() {
			this.model.markLoaded();
		}
	});
	return RSSFeedTorrentView;
});