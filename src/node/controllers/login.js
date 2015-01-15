var logger = require("winston");
var passport = require("passport");
var express = require("express");
var jwt = require("jwt-simple");
var moment = require("moment");
var nconf = require("nconf");
var secret = nconf.get("authentication:secret");
var tokenExpireMinutes = nconf.get("app:tokenExpireMinutes");

module.exports = function(app) {
	app.post("/login", login);
	app.post("/logout", logout);
}

function login (req, res, next) {
	logger.info("Logging in user", req.body.email);

	passport.authenticate("local", function(err, user, info) {
		
		if (err) {
			return next(errors);
		}
		
		if (!user) {
			return res.status(401).send('User and password combination does not match or exist.');
		}
		
		var userId = user._id;
		var email = user.email;
		var expires = moment().add(tokenExpireMinutes, 'minutes').unix();
		logger.info('Generating authentication token expiring at', expires);

		var token = jwt.encode({
			_id: userId + "",
			expires: expires + ""
		}, secret);
		
		return res.json({
			_id: userId,
			expires: expires,
			token: token
		});

	}) (req, res, next);
}

function logout (req, res, next) {
	logger.info("Logging out");
	// Doesn't really do anything unless we really want to keep track of sessions
	// on the server...
	logger.info("Successfully logged out.");

	res.send("ok");
}