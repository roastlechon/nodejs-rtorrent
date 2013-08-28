define([
	"jquery",
	"underscore",
	"backbone",
	"socket.io",
	"router"
], function($, _, Backbone, io, AppRouter) {
	var AppView = Backbone.View.extend({
		el: $("#nodejs-rtorrent"),
		events: {
			"click ul.nav li > a": "navbar"
		},
		initialize: function(options) {
			_.bindAll(this);

			this.vent = options.vent;

			var appRouter = new AppRouter({
				vent: this.vent
			});

			options.vent.bind("setUserInformation", this.setUserInformation);

			Backbone.history.start();
		},
		navbar: function(event) {
			var listItem = $(event.currentTarget).parent();
			this.$("ul.nav li.active").removeClass("active");
			this.$(listItem).addClass("active");
		},
		setUserInformation: function(data) {
			this.$(".navbar .navbar-text").show();
			this.$(".navbar .navbar-text .user").text(data.email);
			this.$(".navbar .login").hide();
		}
	});
	return AppView;
});