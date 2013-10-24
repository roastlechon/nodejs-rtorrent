var logger = require("winston");

var auth = module.exports = {};

auth.ensureAuthenticated = function(req, res, next) {
	logger.info("checking if authenticated");
	if (req.isAuthenticated()) {
		logger.info("authenticated");
		return next();
	} else {
		return res.send(401);
	}
}