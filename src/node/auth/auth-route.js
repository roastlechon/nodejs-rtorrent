var logger = require('winston');
var passportAuthenticate = require('./passport/passport-authenticate');

function login(req, res, next) {
	logger.info('Logging in user', req.body.email);

	passportAuthenticate(req, res, next);
}

function logout(req, res, next) {
	logger.info('Logging out user.');

	// Doesn't really do anything unless we really want to keep track of sessions
	// on the server...
	logger.info('Successfully logged out.');

	res.send('ok');
}

module.exports = function (router) {
	router.route('/login')
		.post(login);

	router.route('/logout')
		.get(logout);
};