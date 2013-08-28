define([
	"jquery",
	"underscore",
	"backbone",
	"mustache",
	"text!templates/rssfeed_edit_modal.html"
], function($, _, Backbone, Mustache, rssfeed_edit_modal) {
	var RSSFeedEditModalView = Backbone.View.extend({
		id: "rssfeed_edit",
		className: "modal fade",
		events: {
			"click .close": "close",
			"click .cancel": "close",
			"submit form": "save"
		},
		initialize: function() {
			console.log("initializing modal");
			console.log(this.model);
		},
		render: function() {
			this.$el.html(Mustache.to_html(rssfeed_edit_modal, this.model.toJSON()));
			return this;
		},
		show: function() {
			$(document.body).append(this.render().el);
			this.$el.modal({backdrop: "static"});
		},
		close: function() {
			$(document.body).find(".modal-backdrop").remove();
			this.remove();
			console.log("closing modal");
		},
		save: function(event) {
			event.preventDefault();
			this.model.set("title", this.$el.find("#rss-feed-title").val());
			this.model.set("rss", this.$el.find("#rss-feed-url").val());
			this.model.save();
			console.log("saving rss feed from modal dialog");
			this.close();
		}
	});
	return RSSFeedEditModalView;
});