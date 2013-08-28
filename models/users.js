var mongoose = require("mongoose");
var User = mongoose.model("User");
var logger = require("winston");

var users = module.exports = {}

users.addUser(user, callback) {
	var user = new User({
		email : user.email,
		password : user.password
	});

	user.save(function(errors, user) {
		if (errors) {
			logger.error("errors occured while saving user");
		} else {
			logger.info("successfully saved user");
		}
	});
}