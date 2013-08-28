define([
	"jquery",
	"underscore",
	"backbone",
	"mustache",
	"text!templates/rssfeed.html",
	"views/RSSFeedTorrentView",
	"views/RSSFeedEditModalView"
], function($, _, Backbone, Mustache, rssfeed, RSSFeedTorrentView, RSSFeedEditModalView) {
	var RSSFeedView = Backbone.View.extend({
		tagName: "li",
		className: "list-group-item",
		events: {
			"click h4 > a": "toggleView",
			"click .edit-rss-feed": "editRssFeed",
			"click .remove-rss-feed": "removeRssFeed",
			"click .refresh-rss-feed": "refreshRssFeed"
		},
		initialize: function() {
			_.bindAll(this, "render", "toggleView", "editRssFeed", "removeRssFeed", "refreshRssFeed");
			this.model.on("change", this.render);
		},
		render: function() {
			var that = this;
			this.$el.html(Mustache.to_html(rssfeed, this.model.toJSON()));
			this.model.get("torrents").each(function(torrent) {
				var rssFeedTorrentView = new RSSFeedTorrentView({
					model: torrent
				});
				that.$el.find("ul.rss-torrents").append(rssFeedTorrentView.render().el);
			});
			return this;
		},
		toggleView: function() {
			this.$el.find("ul.rss-torrents").toggle();
		},
		editRssFeed: function() {
			var rssFeedEditModalView = new RSSFeedEditModalView({
				model: this.model
			});
			rssFeedEditModalView.show();
		},
		removeRssFeed: function() {
			this.model.removeRssFeed();
		},
		refreshRssFeed: function() {
			this.model.refreshRssFeed();
		}
	});
	return RSSFeedView;
});