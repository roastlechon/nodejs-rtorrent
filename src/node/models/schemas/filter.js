var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FilterSchema = new Schema({
	regex: String,
	type: String
});

module.exports = mongoose.model("Filter", FilterSchema);
