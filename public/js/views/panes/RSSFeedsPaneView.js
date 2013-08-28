define([
	"jquery",
	"underscore",
	"backbone",
	"text!templates/panes/rssfeeds_pane.html",
	"views/RSSFeedsView"
], function($, _, Backbone, rssfeeds_pane, RSSFeedsView) {
	var RSSFeedsPaneView = Backbone.View.extend({
		initialize: function(options) {
			this.vent = options.vent;
		},
		render: function() {
			this.$el.html(rssfeeds_pane);
			var rssFeeds = new RSSFeedsView({
				vent: this.vent,
				el: $("ul#rssfeeds")
			});
		}
	});
	return RSSFeedsPaneView;
});
