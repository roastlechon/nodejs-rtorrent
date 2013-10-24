define([
	"jquery",
	"underscore",
	"backbone",
	"models/RSSFeedModel"
], function($, _, Backbone, RSSFeedModel) {
	var RSSFeedCollection = Backbone.Collection.extend({
		url: "/rssfeeds/",
		model: RSSFeedModel,
		initialize: function() {
		}
	});
	return RSSFeedCollection;
});