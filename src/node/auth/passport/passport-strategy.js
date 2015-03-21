var logger = require('winston');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/schemas/user');

	

module.exports = function (passport) {
	passport.use(new LocalStrategy({
			usernameField: 'email'
		}, function(email, password, done) {

			User.findOne({
				email: email
			}).exec()
				.then(function (user) {
					if (!user) {
						return done(new Error('User does not exist.'));
					}

					user.comparePassword(password, function (err, match) {
						if (err) {
							return done(err);
						}

						if (match) {
							return done(null, user);
						} else {
							return done(new Error('Password does not match.'));
						}
					});

				}, function (err) {
					return done(err);
				});
		})
	);
};