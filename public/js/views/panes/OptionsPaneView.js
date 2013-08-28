define([
	"jquery",
	"underscore",
	"backbone",
	"text!templates/panes/options_pane.html"
], function($, _, Backbone, options_pane) {
	var OptionsPaneView = Backbone.View.extend({
		render: function() {
			this.$el.html(options_pane);
		}
	});
	return OptionsPaneView;
});
