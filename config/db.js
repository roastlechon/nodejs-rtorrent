var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var Schema = mongoose.Schema;

var Torrent = new Schema({
	name: String,
	url: String,
	status: String,
	date: Date
});

mongoose.model("Torrent", Torrent);

var Feed = new Schema({
	title: String,
	rss: String,
	torrents: [Torrent]
});

mongoose.model("Feed", Feed);

var User = new Schema({
	email: String,
	password: String
});

User.pre("save", function(next) {
	var user = this;
	if (!user.isModified("password")) {
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


User.methods.comparePassword = function(password, callback) {
	bcrypt.compare(password, this.password, function(errors, match) {
		if (errors) {
			callback(errors, null);
		} else {
			callback(null, match);
		}
	});
};

mongoose.model("User", User);

mongoose.connect("mongodb://localhost/nodejs-rtorrent");