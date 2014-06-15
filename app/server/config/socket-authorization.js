var nconf = require("nconf");
var jwt = require("jwt-simple");
var logger = require("winston");
var secret = nconf.get("authentication:secret");

module.exports = function(handshakeData, callback) {
    var queryToken = handshakeData.query.token;
    if (!queryToken) {
      logger.error("Authorization token does not exist.");
      return callback("Authorization token does not exist.");
    }

    var authenticationHeaderArray = queryToken.split(":");

    var clientUserId = authenticationHeaderArray[0];
    var clientExpires = authenticationHeaderArray[1];
    var clientToken = authenticationHeaderArray[2];

    var token = jwt.encode({
      _id: clientUserId + "",
      expires: clientExpires + ""
    }, secret);

    if (token === clientToken) {
      logger.info("Successfully authenticated via token.");
      return callback(null, true);
    } else {
      logger.error("Authentication token does not match.");
      return callback(null, false);
	}
}
