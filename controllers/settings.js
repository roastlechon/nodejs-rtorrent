var logger = require("winston");
var auth = require("./auth.js");

module.exports = function(app) {
	app.get("/settings", auth.ensureAuthenticated, getSettings);
}

function getSettings(req, res) {
	logger.info("client's ip address is: %s", req.connection.remoteAddress);
	res.json({});
}