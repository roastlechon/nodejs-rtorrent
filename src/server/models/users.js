var mongoose = require("mongoose");
var User = mongoose.model("User");
var logger = require("winston");
var Q = require("q");

var users = module.exports = {}

function checkUserExists(email) {
	return User.find({
		"email": email
	}).exec();
}

users.add = function(user) {
	var deferred = Q.defer();

	checkUserExists(user.email).then(function(data) {
		// User does not exist
		if (data.length === 0) {
			var userModel = new User({
				email: user.email,
				password: user.password
			});

			userModel.save(function(err, results) {
				if (err) {
					return deferred.reject(err);
				}
				return deferred.resolve(results);
			});
		}
		return deferred.reject("User exists");
	}, function(err) {
		return deferred.reject(err);
	});

	return deferred.promise;
}