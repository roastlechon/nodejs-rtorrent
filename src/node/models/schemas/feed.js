var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Torrent = require("./torrent");
var Filter = require("./filter");

var FeedSchema = new Schema({
	title: String,
	path: String,
	lastChecked: String,
	rss: String,
	autoDownload: Boolean,
	torrents: [Torrent.schema],
	filters: [Filter.schema],
});

module.exports = mongoose.model("Feed", FeedSchema);