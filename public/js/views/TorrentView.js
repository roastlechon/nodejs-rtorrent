define([
	"jquery",
	"underscore",
	"backbone",
	"mustache",
	"text!templates/torrent.html"
], function($, _, Backbone, Mustache, torrent) {
	var TorrentView = Backbone.View.extend({
		tagName: "li",
		className: "list-group-item",
		events: {
			"click .play": "startTorrent",
			"click .pause": "pauseTorrent",
			"click .stop": "stopTorrent",
			"click .delete": "removeTorrent",
		},
		initialize: function() {
			this.listenTo(this.model, "change", this.render);
			this.listenTo(this.model, "remove", this.remove);
		},
		render: function() {
			this.$el.html(Mustache.to_html(torrent, this.model.toJSON()));
			if (this.model.get("status") === "checking") {
				this.$el.find(".progress > div").removeClass();
				this.$el.find(".progress > div").addClass("progress-bar progress-bar-warning");
			} else if (this.model.get("status") === "seeding") {
				this.$el.find(".progress > div").removeClass();
				this.$el.find(".progress > div").addClass("progress-bar progress-bar-success");
			}
			return this;
		},
		remove: function() {
			this.$el.remove();
		},
		startTorrent: function(event) {
			this.model.startTorrent();
		},
		pauseTorrent: function(event) {
			this.model.pauseTorrent();
		},
		stopTorrent: function(event) {
			this.model.stopTorrent();
		},
		removeTorrent: function(event) {
			this.model.removeTorrent();
		}
	});
	return TorrentView;
});