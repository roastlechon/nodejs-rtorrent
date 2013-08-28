define([
	"jquery",
	"underscore",
	"backbone"
], function($, _, Backbone) {
	var TorrentLinkModel = Backbone.Model.extend({
		addTorrentLink: function() {
			$.ajax({
				url: "/torrent/addlink",
				type: "POST",
				dataType: "json",
				data: this.toJSON()
			});
		}
	});
	return TorrentLinkModel;
});