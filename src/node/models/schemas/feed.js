var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedSchema = new Schema({
	title: String,
	path: String,
	lastChecked: String,
	rss: String,
	autoDownload: Boolean,
	torrents: [{
    name: String,
    url: String,
    status: String,
    date: Date
  }],
	filters: [{
    regex: {
      type: String
    },
    type: {
      type: String
    }
  }]
});

module.exports = mongoose.model('Feed', FeedSchema);
