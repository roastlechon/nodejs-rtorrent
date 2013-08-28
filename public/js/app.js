// Filename: app.js
define([
	"jquery",
	"underscore",
	"backbone",
	"views/AppView",
	"bootstrap"
], function($, _, Backbone, AppView) {
	var initialize = function() {
		var vent = _.extend({}, Backbone.Events);
		var appView = new AppView({
			vent: vent
		});
	}
	return {
		initialize: initialize
	};
});