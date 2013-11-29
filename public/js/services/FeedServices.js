define([
	"services"
], function(serviceModule) {
	"use strict";
	return serviceModule.factory("FeedFactory", function($resource) {
		return $resource("/rssfeeds/:id", {}, {
			get: {
				method: "GET",
				params: {
					id: "@id"
				}
			}
		});
	});
});