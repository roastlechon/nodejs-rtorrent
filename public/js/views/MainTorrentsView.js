define([
	"jquery",
	"underscore",
	"backbone",
	"socket.io"
], function($, _, Backbone, io) {
	var MainTorrentsView = Backbone.View.extend({
		_initialize: function() {
			console.log("opening up socket connection");

			this.socket = io.connect("http://home.roastlechon.com:3000", {
				"force new connection" : true,
				"sync disconnect on unload" : true
			});

			if (this.socket_events && _.size(this.socket_events) > 0) {
				this.delegateSocketEvents(this.socket_events);
			}
		},
		delegateSocketEvents: function(events) {
			var that = this;
			for (var key in events) {
				var method = events[key];
				if (!_.isFunction(method)) {
					method = this[events[key]];
				}
				if (!method) {
					throw new Error("Method \"" + events[key] + "\"does not exist");
				}

				method = _.bind(method, this);
				that.socket.on(key, method);
			}
		}
	});
	return MainTorrentsView;
});