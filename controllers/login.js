var logger = require("winston");
var passport = require("passport");
var express = require("express");

module.exports = function(app) {
	app.post("/login", login);
	app.post("/logout", logout);
}

function login(req, res, next) {
	logger.info("logging in");
	passport.authenticate("local", function(errors, user, info) {
		logger.info("trying to authenticate");
		if (errors) {
			logger.error("errors occured", errors);
			return next(errors);
		}
		if (!user) {
			logger.error("user doesnt exist");
			req.session.messages = [info.message];
			return res.send(401);
		}
		req.logIn(user, function(errors) {
			if (errors) {
				logger.error("errors occured", errors);
				return next(errors);
			}
			logger.info("successfully logged in");
			return res.json({
				_id: user._id,
				email: user.email
			});
		});
	})(req, res, next);
}

function logout(req, res, next) {
	logger.info("logging out");
	req.logout();
	logger.info("successfully logged out");
	res.send("ok");
}