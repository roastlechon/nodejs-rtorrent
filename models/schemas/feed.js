var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Torrent = require("./torrent");

var FeedSchema = new Schema({
	title: String,
	lastChecked: String,
	rss: String,
	torrents: [Torrent.schema]
});

module.exports = mongoose.model("Feed", FeedSchema);