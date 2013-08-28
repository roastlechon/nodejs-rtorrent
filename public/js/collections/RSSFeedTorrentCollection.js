define([
	"jquery",
	"underscore",
	"backbone",
	"models/RSSFeedTorrentModel"
], function($, _, Backbone, RSSFeedTorrentModel) {
	var RSSFeedTorrentCollection = Backbone.Collection.extend({
		model: RSSFeedTorrentModel,
		initialize: function() {
			
		}
	});
	return RSSFeedTorrentCollection;
});