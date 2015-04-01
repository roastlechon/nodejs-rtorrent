var addFeed = require('./add-feed/add-feed');
var editFeed = require('./edit-feed/edit-feed');
var viewFeed = require('./view-feed/view-feed');
var deleteFeed = require('./delete-feed/delete-feed');
var viewFeeds = require('./view-feeds/view-feeds');


module.exports = angular
	.module('njrt.feeds', [
		addFeed.name,
		editFeed.name,
		viewFeed.name,
		deleteFeed.name,
		viewFeeds.name
	]);

require('./feeds-factory');