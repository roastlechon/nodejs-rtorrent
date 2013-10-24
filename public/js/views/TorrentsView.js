define([
	"jquery",
	"underscore",
	"backbone",
	"models/TorrentModel",
	"views/MainTorrentsView",
	"views/TorrentView",
	"views/LoginModalView",
	"collections/TorrentCollection"
], function($, _, Backbone, TorrentModel, MainTorrentsView, TorrentView, LoginModalView, TorrentCollection) {
	var TorrentsView = MainTorrentsView.extend({
		initialize: function(options) {
			_.bindAll(this);

			this.vent = options.vent;
			this.hiddenColumns = [];
			this._initialize();

			this.listenTo(this.collection.filtered, "reset", this.render);
			options.vent.bind("hideColumn", this.hideColumn);
			options.vent.bind("showColumn", this.showColumn);
			options.vent.bind("successAuthentication", this.successAuthentication);
		},
		socket_events: {
			"torrents" : "torrents",
			"error": "error",
			"connect": "connect",
			"connecting": "connecting",
			"user": "setUserInformation",
			"connect_failed": "connectFailed"
		},
		torrents: function(torrents) {
			var that = this;
			var a = [];
			var b = [];

			this.collection.each(function(torrentModel) {
				a.push(torrentModel.get("hash"));
			});
				
			_.each(torrents, function(torrent) {
				b.push(torrent.hash);
			});

			_.each(_.difference(a, b), function(value) {
				var torrentModel = that.collection.findWhere({hash : value});
				that.collection.remove(torrentModel);
			});

			// remove torrents not in list
			_.each(torrents, function(torrent) {
				var torrentModel = that.collection.findWhere({hash : torrent.hash})
				if (torrentModel) {
					torrentModel.set(torrent);
					//console.log("torrent exists in collection");
				} else {
					//console.log("torrent does not exist in collection, creating model and view and adding to collection.")

					// create new model
					var torrentModel = new TorrentModel(torrent);

					// add model to collection
					that.collection.add(torrentModel);
				}
			});
		},
		render: function() {
			var that = this;
			
			$(this.el).find("tbody").empty();

			this.collection.filtered.each(function(torrentModel) {
				var torrentView = new TorrentView({
					model : torrentModel,
					hiddenColumns : that.hiddenColumns
				});
				$(that.el).find("tbody").append(torrentView.render().el);
			});
		},
		hideColumn: function(column) {
			console.log(column);
			this.hiddenColumns.push(column);
		},
		showColumn: function(column) {
			console.log(column);
			this.hiddenColumns = _.reject(this.hiddenColumns, function(columnName) {
				return columnName == column;
			});
		},
		setUserInformation: function(data) {
			console.log("set user information");
			console.log("logged in as ", data.email);
			this.vent.trigger("setUserInformation", data);
		},
		successAuthentication: function(data) {
			console.log("logged in as ", data.email);
			this.vent.trigger("setUserInformation", data);
			this._initialize();
		},
		failedAuthentication: function() {
			console.log("failed to authenticate");
		},
		error: function(error) {
			console.log(error);
			console.error("not logged in");
			var loginModalView = new LoginModalView({
				vent: this.vent
			});
			loginModalView.show();
		},
		connecting: function() {
			console.log("trying to connect");
		},
		connect: function() {
			console.log("successfully connected");
		},
		connectFailed: function() {
			console.log("connect failed");
		}
	});
	return TorrentsView;
});