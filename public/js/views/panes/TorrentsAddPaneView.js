define([
	"jquery",
	"underscore",
	"backbone",
	"text!templates/panes/add_torrent_pane.html",
	"models/TorrentLinkModel",
	"jquery.fileupload",
	"jquery.iframe-transport"
], function($, _, Backbone, add_torrent_pane, TorrentLinkModel) {
	var TorrentsAddPaneView = Backbone.View.extend({
		events: {
			"click #submit-torrent-url": "addTorrentLink"
		},
		render: function() {
			this.$el.html(add_torrent_pane);
			this.$el.find("#torrent-upload").fileupload({
				dataType: "json"
			});
		},
		addTorrentLink: function() {
			torrentLink = new TorrentLinkModel();
			torrentLink.set("url", this.$el.find("#torrent-url").val());
			torrentLink.addTorrentLink();
			this.clearInput();
		},
		clearInput: function() {
			this.$el.find("#torrent-url").val("");
		}
	});
	return TorrentsAddPaneView;
});
