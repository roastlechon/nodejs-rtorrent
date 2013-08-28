define([
	"jquery",
	"underscore",
	"backbone",
	"views/panes/TorrentsPaneView",
	"views/panes/TorrentsAddPaneView",
	"views/panes/RSSFeedsPaneView",
	"views/panes/RSSFeedsAddPaneView",
	"views/panes/OptionsPaneView",
	"views/LoginModalView"
], function($, _, Backbone, TorrentsPaneView, TorrentsAddPaneView, RSSFeedsPaneView, RSSFeedsAddPaneView, OptionsPaneView, LoginModalView) {
	var AppRouter = Backbone.Router.extend({
		initialize: function(options) {
			this.vent = options.vent;
		},
		routes: {
			"": "index",
			"torrents": "torrents",
			"torrents-upload": "torrentsUpload",
			"torrents-add": "torrentsAdd",
			"rssfeeds": "rssFeeds",
			"rssfeeds-add": "rssFeedsAdd",
			"options": "options",
			"login": "login",
			"logout": "logout",
			"default": "index"
		},
		index: function() {
			$("#nodejs-rtorrent .tab-content").empty();
		},
		torrents: function() {
			console.log("torrents route triggered");
			var torrentsPaneView = new TorrentsPaneView({
				vent: this.vent,
				el: $("#nodejs-rtorrent .tab-content")
			});
			torrentsPaneView.render();
		},
		torrentsAdd: function() {
			console.log("torrents add route triggered");
			var torrentsAddPaneView = new TorrentsAddPaneView({
				el: $("#nodejs-rtorrent .tab-content")
			});
			torrentsAddPaneView.render();
		},
		rssFeeds: function() {
			console.log("rssfeeds route triggered");
			var rssFeedsPaneView = new RSSFeedsPaneView({
				vent: this.vent,
				el: $("#nodejs-rtorrent .tab-content")
			});
			rssFeedsPaneView.render();
		},
		rssFeedsAdd: function() {
			console.log("rssfeeds add route triggered");
			var rssFeedsAddPaneView = new RSSFeedsAddPaneView({
				el: $("#nodejs-rtorrent .tab-content")
			});
			rssFeedsAddPaneView.render();
		},
		login: function() {
			console.log("login route triggered");
			var loginModalView = new LoginModalView({
				vent: this.vent
			});
			loginModalView.show();
		},
		logout: function() {
			console.log("logout route triggered");
			console.log("logging out");
			$.ajax({
				url: "/logout",
				type: "POST"
			}).done(function() {
				console.log("finished logging out");
				window.location.replace("/#");
			});
		},
		options: function() {
			console.log("options route triggered");
			var optionsPaneView = new OptionsPaneView({
				el: $("#nodejs-rtorrent .tab-content")
			});
			optionsPaneView.render();
		}

	});
	return AppRouter;
});