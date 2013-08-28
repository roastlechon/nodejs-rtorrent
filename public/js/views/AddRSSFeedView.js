define([
	"jquery",
	"underscore",
	"backbone",
	"models/RSSFeedModel",
	"collections/RSSFeedCollection"
], function($, _, Backbone, RSSFeedModel, RSSFeedCollection) {
	var AddRSSFeedView = Backbone.View.extend({
		events: {
			"click #submit-rss-feed": "addRssFeed"
		},
		initialize: function() {
			this.collection = new RSSFeedCollection();
			this.collection.fetch();
			this.collection.on("add", this.clearInput, this);
		},
		addRssFeed: function() {
			var rssFeed = new RSSFeedModel({
				title: this.$el.find("#rss-feed-name").val(),
				rss: this.$el.find("#rss-feed-url").val(),
				torrents: []
			});
			console.log("about to add to collection");
			this.collection.add(rssFeed);
			console.log("added");
			rssFeed.addRssFeed();

		},
		clearInput: function() {
			this.$el.find("#rss-feed-name").val("");
			this.$el.find("#rss-feed-url").val("");
		}
	});
	return AddRSSFeedView;
});