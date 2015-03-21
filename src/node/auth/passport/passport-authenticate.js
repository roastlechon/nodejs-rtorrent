var logger = require('winston');
var passport = require('passport');
var jwt = require('jwt-simple');
var moment = require('moment');
var nconf = require('nconf');
var secret = nconf.get('authentication:secret');
var tokenExpireMinutes = nconf.get('app:tokenExpireMinutes');

module.exports = function (req, res, next) {
	passport.authenticate("local", function(err, user) {
		
		if (err) {
			logger.error(err.message);
			if (err.message === 'User does not exist.' || err.message === 'Password does not match.') {
				return res.status(401).send('User and password combination does not match or exist.');
			} else {
				return next(err);
			}
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

	})(req, res, next);
};