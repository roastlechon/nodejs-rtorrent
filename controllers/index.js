var logger = require("winston");
var passport = require("passport");
var express = require("express");

module.exports = function(app) {
	app.get("/", index);
}

function index(req, res) {
	logger.info("rendering view");
	logger.info("client's ip address is: %s", req.connection.remoteAddress);
	res.render("index", {
		head : {
			title : "nodejs-rtorrent"
		},
		body : {
			title : "nodejs-rtorrent"
		}
	});
	logger.info("finished rendering");
}