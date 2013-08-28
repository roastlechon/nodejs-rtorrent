define([
	"jquery",
	"underscore",
	"backbone"
], function($, _, Backbone) {
	var CredentialModel = Backbone.Model.extend({
		login: function(callback) {
			var that = this;
			console.log(this);
			$.ajax({
				url: "/login",
				type: "POST",
				dataType: "json",
				data: {
					"email": that.get("email"), 
					"password": that.get("password")
				}
			}).done(function(data) {
				callback(data);
			});
		}
	});
	return CredentialModel;
});