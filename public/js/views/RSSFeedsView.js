define([
	"jquery",
	"underscore",
	"backbone",
	"views/RSSFeedView",
	"collections/RSSFeedCollection",
	"views/LoginModalView"
], function($, _, Backbone, RSSFeedView, RSSFeedCollection, LoginModalView) {
	var RSSFeedsView = Backbone.View.extend({
		events: {
			"click .refresh-rss-feed": "refreshFeeds"
		},
		initialize: function(options) {
			var that = this;
			this.vent = options.vent;
			this.collection = new RSSFeedCollection();
			this.collection.fetch({
				success: function(collection, data) {
					console.log("success call");
					if (data === 0) {
						console.error("not logged in");
						var loginModalView = new LoginModalView({
							vent: that.vent
						});
						loginModalView.show();
					} else {
						return collection;
					}
				}
			});
			this.collection.on("add", this.render, this);
		},
		render: function(rssFeed) {
			var rssFeedView = new RSSFeedView({
				model: rssFeed
			});
			this.$el.append(rssFeedView.render().el);
		},
		refreshFeeds: function() {
			this.collection.fetch({reset: true});
		}
	});
	return RSSFeedsView;
});