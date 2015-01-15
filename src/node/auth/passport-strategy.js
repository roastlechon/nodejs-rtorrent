var logger = require("winston");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("../models/schemas/user");

passport.use(new LocalStrategy({
		usernameField: "email"
	},
	function(email, password, done) {

		User.findOne({
			email: email
		}, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, {
					message: "Incorrect username."
				});
			}
			user.comparePassword(password, function(err, match) {
				if (err) {
					return done(err);
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