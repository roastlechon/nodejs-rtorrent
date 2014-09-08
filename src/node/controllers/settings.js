var logger = require("winston");
var auth = require("./auth");
var settings = require("./models/settings");

module.exports = function(app) {
	app.get("/settings", auth.ensureAuthenticated, getSettings);
}

function getSettings(req, res) {
	res.json({});
}