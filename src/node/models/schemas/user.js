var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
	email: String,
	password: String
});

UserSchema.pre('save', function(next) {
	var user = this;
	if (!user.isModified('password')) {
		return next();
	}
	bcrypt.genSalt(10, function(errors, salt) {
		if (errors) {
			return next(errors);
		} else {
			bcrypt.hash(user.password, salt, function(errors, hash) {
				if (errors) {
					return next(errors);
				} else {
					user.password = hash;
					next();
				}
			});
		}
	});
});

UserSchema.methods.comparePassword = function(password, callback) {
	bcrypt.compare(password, this.password, function(errors, match) {
		if (errors) {
			callback(errors, null);
		} else {
			callback(null, match);
		}
	});
};

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
