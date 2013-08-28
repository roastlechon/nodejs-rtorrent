define([
	"jquery",
	"underscore",
	"backbone",
	"collections/RSSFeedTorrentCollection",
	"views/LoginModalView"
], function($, _, Backbone, RSSFeedTorrentCollection, LoginModalView) {
	var RSSFeedModel = Backbone.Model.extend({
		initialize: function() {
			console.log("creating new rss feed model");
			var torrents = new RSSFeedTorrentCollection(this.get("torrents"));
			console.log("setting stuff");
			this.set("torrents", torrents);
		},
		addRssFeed: function() {
			var that = this;
			console.log("trying to add feed");
			$.ajax({
				url: "/rssfeeds",
				type: "POST",
				dataType: "json",
				data: {"rss": this.get("rss"), "title": this.get("title")}
			}).done(function(data) {
				if (data === 0) {
					console.error("not logged in");
					var loginModalView = new LoginModalView();
					loginModalView.show();
				} else {
					console.log(data);
					that.set({
						_id: data._id,
						rss: data.rss,
						title: data.title,
						torrents: new RSSFeedTorrentCollection(data.torrents)
					});
					console.log("setting torrents in rss feed model");
				}
			});
		},
		save: function() {
			$.ajax({
				url: "/rssfeeds/" + this.get("_id"),
				type: "PUT",
				dataType: "json",
				data: {
					"title": this.get("title"),
					"rss": this.get("rss")
				}
			});
			console.log("editing rss feed" + this.get("title"));
		},
		removeRssFeed: function() {
			console.log("removing rss feed" + this.get("title"));
		},
		refreshRssFeed: function() {
			console.log("refreshing rss feed" + this.get("title"));
		}
	});
	return RSSFeedModel;
});