define([
	"jquery",
	"underscore",
	"backbone",
	"text!templates/panes/torrents_pane.html",
	"views/TorrentsView",
	"collections/TorrentCollection"
], function($, _, Backbone, torrents_pane, TorrentsView, TorrentCollection) {
	var TorrentsPaneView = Backbone.View.extend({
		initialize: function(options) {
			this.vent = options.vent;
		},
		render: function() {
			this.$el.html(torrents_pane);
			var torrentCollection = new TorrentCollection();
			var app = new TorrentsView({
				vent: this.vent,
				el: $("ul#torrents"),
				collection: torrentCollection
			});
		}
	});
	return TorrentsPaneView;
});