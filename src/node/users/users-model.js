var logger = require('winston');
var User = require('../models/schemas/user');

exports.add = function (user) {
	return User
		.findOne({
			'email': user.email
		})
		.exec()
			.then(function(data) {

				// User does not exist
				if (!data) {
					var userModel = new User({
						email: user.email,
						password: user.password
					});

					return User.create(userModel);
				}

				throw new Error('User exists.');

			});
};