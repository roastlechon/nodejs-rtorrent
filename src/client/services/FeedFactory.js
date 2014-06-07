var serviceModule = require("../services");

serviceModule.factory("FeedFactory", function(Restangular) {
	Restangular.setRestangularFields({
		id: "_id"
	});
	
	return {
		getFeeds: function() {
			var feeds = Restangular.all("feeds");
			return feeds.getList();
		},
		getFeed: function(id) {
			var feed = Restangular.one("feeds", id);
			return feed.get();
		},
		addFeed: function(feed) {
			console.log(feed);
			var feeds = Restangular.all("feeds");
			return feeds.post(feed);
		},
		updateFeed: function(feed) {
			return feed.put();
		},
		deleteFeed: function(feed) {
			return feed.remove();
		}
	};
});