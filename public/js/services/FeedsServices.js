define([
	"services"
], function(serviceModule) {
	"use strict";
	return serviceModule.factory("FeedsFactory", function($resource) {
		return $resource("/rssfeeds", {}, {
			query: {
				method: "GET",
				isArray: true
			},
			add: {
				method: "POST"
			}

		});
	});
});