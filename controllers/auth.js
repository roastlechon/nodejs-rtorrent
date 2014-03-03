var logger = require("winston");
var jwt = require("jwt-simple");
var secret = "123456789";

module.exports = {
	ensureAuthenticated: function(req, res, next) {
		logger.info("Client's IP Address is: %s", req.connection.remoteAddress);
		logger.info("Checking if authenticated.");

		if (!req.headers.authorization) {
			logger.error("Authorization Header does not exist.");
			return res.send(401);
		}

		var authenticationHeader = req.headers.authorization.split(" ")[1];
		var authenticationHeaderArray = authenticationHeader.split(":");

		logger.info(authenticationHeaderArray);

		var clientUserId = authenticationHeaderArray[0];
		var clientExpires = authenticationHeaderArray[1];
		var clientToken = authenticationHeaderArray[2];
		
		var token = jwt.encode({
			_id: clientUserId + "",
			expires: clientExpires + ""
		}, secret);

		logger.info(clientToken);
		logger.info(token);

		logger.info(jwt.decode(clientToken, secret));


		if (token === clientToken) {
			logger.info("authenticated via token");
			return next();
		} 
		
		logger.error("authentication token does not match");
		return res.send(401);
	}
};