define([
	"jquery",
	"underscore",
	"backbone",
	"text!templates/panes/add_rss_feed_pane.html",
	"models/RSSFeedModel"
], function($, _, Backbone, add_rss_feed_pane, RSSFeedModel) {
	var RSSFeedsAddPaneView = Backbone.View.extend({
		events: {
			"click #submit-rss-feed": "addRssFeed"
		},
		render: function() {
			this.$el.html(add_rss_feed_pane);
		},
		addRssFeed: function() {
			var rssFeed = new RSSFeedModel({
				title: this.$el.find("#rss-feed-name").val(),
				rss: this.$el.find("#rss-feed-url").val(),
				torrents: []
			});
			rssFeed.addRssFeed();
			this.clearInput();
		},
		clearInput: function() {
			this.$el.find("#rss-feed-name").val("");
			this.$el.find("#rss-feed-url").val("");
		}
	});
	return RSSFeedsAddPaneView;
});
