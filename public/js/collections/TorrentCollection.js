define([
	"jquery",
	"underscore",
	"backbone",
	"models/TorrentModel"
], function($, _, Backbone, TorrentModel) {
	var TorrentCollection = Backbone.Collection.extend({
		model: TorrentModel,
		initialize: function() {
			this.on("change", function() {
				
			});
		}
	});
	return TorrentCollection;
});