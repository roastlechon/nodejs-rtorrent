var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TorrentSchema = new Schema({
	name: String,
	url: String,
	status: String,
	date: Date
});

module.exports = mongoose.model("Torrent", TorrentSchema);