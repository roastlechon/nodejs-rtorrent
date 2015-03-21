var logger = require('winston');
var jwt = require('jwt-simple');
var nconf = require('nconf');
var moment = require('moment');
var Q = require('q');
var secret = nconf.get('authentication:secret');


function checkAuthentication(jsonToken) {

	var deferred = Q.defer();

	var currentUnixTime = moment().unix();

	if (currentUnixTime > jsonToken.expires) {
		deferred.reject(new Error('Authentication token has expired.'));
	}

	// Encode token based on id, expires, and secret
	var tmpToken = jwt.encode({
		_id: jsonToken._id,
		expires: jsonToken.expires
	}, secret);

	// Compare token from supplied token if it is the same
	if (jsonToken.token === tmpToken) {
		logger.info('Authenticated via token.');

		deferred.resolve(jsonToken.token);
	} 
	
	deferred.reject(new Error('Authentication token does not match.'));

	return deferred.promise;
}


function parseBearerToken(bearerToken) {

	var deferred = Q.defer();

	if (!bearerToken) {
		deferred.reject(new Error('Authorization token does not exist.'));
	}

	var authenticationHeaderArray = bearerToken.split(':');

	if (!(authenticationHeaderArray instanceof Array) || authenticationHeaderArray.length !== 3) {
		deferred.reject(new Error('Authorization token not valid.'));
	}

	deferred.resolve({
		_id: authenticationHeaderArray[0],
		expires: authenticationHeaderArray[1],
		token: authenticationHeaderArray[2]
	});

	return deferred.promise;

}

// Authentication check for Express
function isAuthenticated(req, res, next) {

	if (!req.headers.authorization) {
		return res.status(401).send('Authorization Header does not exist.');
	}

	var bearerToken = req.headers.authorization.split(' ')[1];
	
	parseBearerToken(bearerToken)
		.then(function (jsonToken) {
			return checkAuthentication(jsonToken);
		})
		.then(function () {
			return next();
		}, function (err) {
			return res.status(401).send(err.message);
		});
}

// Authentication check for Socket.IO
function isSocketAuthenticated(socket, next) {

    var bearerToken = socket.handshake.query.token;

    parseBearerToken(bearerToken)
    	.then(function (jsonToken) {
    		return checkAuthentication(jsonToken);
    	})
    	.then(function () {
			return next();
		}, function (err) {
    		return next(err);
    	});
}

module.exports = {
	isAuthenticated: isAuthenticated,
	isSocketAuthenticated: isSocketAuthenticated
}