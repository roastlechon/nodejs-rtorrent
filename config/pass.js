var logger = require("winston");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = mongoose.model("User");

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy({
		usernameField: "email"
	},
	function(email, password, done) {
		logger.info("something");
		User.findOne({
			email: email
		}, function(errors, user) {
			logger.info("validating user");
			if (errors) {
				logger.error("errors");
				return done(err);
			}
			if (!user) {
				return done(null, false, {
					message: "Incorrect username."
				});
			}
			user.comparePassword(password, function(errors, match) {
				if (errors) {
					return done(errors);
				}
				if (match) {
					return done(null, user);
				} else {
					return done(null, false, {
						message: "invalid password"
					});
				}
			});
		});
	}
));