define([
	"jquery",
	"underscore",
	"backbone",
	"mustache",
	"text!templates/login_modal.html",
	"models/CredentialModel",
	"router"
], function($, _, Backbone, Mustache, login_modal, CredentialModel) {
	// Create new view and render on click
	// 
	var LoginModalView = Backbone.View.extend({
		id: "login-modal",
		className: "modal fade",
		events: {
			"click .close": "close",
			"click .cancel": "close",
			"submit form": "login"
		},
		initialize: function(options) {
			this.vent = options.vent;
		},
		render: function() {
			this.$el.html(login_modal);
			return this;
		},
		show: function() {
			$(document.body).append(this.render().el);
			this.$el.modal({backdrop: "static"});
		},
		close: function() {
			$(document.body).find(".modal-backdrop").remove();
			$(document.body).removeClass("modal-open");
			this.remove();
			console.log("closing modal");
			Backbone.history.navigate("#", true);
		},
		login: function(event) {
			var that = this;
			event.preventDefault();
			// create new model and call authenticate method
			var credentialModel = new CredentialModel({
				email: this.$("#email").val(),
				password: this.$("#password").val()
			});
			credentialModel.login(function(data) {
				if (data === 0) {
					that.vent.trigger("failedAuthentication")
				} else {
					that.vent.trigger("successAuthentication", data);
				}
			});
			this.close();
		}
	});
	return LoginModalView;
});