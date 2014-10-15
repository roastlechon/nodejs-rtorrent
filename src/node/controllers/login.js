var logger = require("winston");
var passport = require("passport");
var express = require("express");
var jwt = require("jwt-simple");
var moment = require("moment");
var nconf = require("nconf");
var secret = nconf.get("authentication:secret");

module.exports = function(app) {
	app.post("/login", login);
	app.post("/logout", logout);
}

function login(req, res, next) {
	logger.info("logging in");
	passport.authenticate("local", function(errors, user, info) {
		logger.info("trying to authenticate");
		if (errors) {
			logger.error("errors occured");
			logger.error(errors);
			return next(errors);
		}
		
		if (!user) {
			logger.error("user doesnt exist");
			console.log("info message");
			console.log(info);
			return res.send(401);
		}
		
		logger.info("successfully logged in");
		logger.info("generating token");
		
		var userId = user._id;
		var email = user.email;
		var expires = moment().add("minutes", 5).unix();
		logger.info("user id is " + userId);
		logger.info("token will expire at " + expires);

		var token = jwt.encode({
			_id: userId + "",
			expires: expires + ""
		}, secret);

		// sessions.addToken({
		// 	email: email,
		// 	token: token,
		// 	expires: expires
		// }, function(doc) {
		// 	logger.info("successfully added token");
		// 	logger.info(doc);
		// }, function(error) {
		// 	logger.error("error adding token");
		// 	logger.error(error)
		// });
		
		return res.json({
			_id: userId,
			expires: expires,
			token: token
		});

	})(req, res, next);
}

function logout(req, res, next) {
	logger.info("logging out");
	
	logger.info("successfully logged out");
	res.send("ok");
}