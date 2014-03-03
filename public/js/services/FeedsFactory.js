define([
	"services"
], function(serviceModule) {
	"use strict";
	return serviceModule.factory("FeedsFactory", function($http) {
		return {
			single: function(id, success, error) {
				$http.get("/rssfeeds/" + id).success(function(res) {
					success(res);
				}).error(error);
			},
			query: function(success, error) {
				$http.get("/rssfeeds").success(function(res) {
					success(res);
				}).error(error);
			},
			add: function(feed, success, error) {
				$http.post("/rssfeeds", feed).success(function(res) {
					success(res);
				}).error(error);
			},
			edit: function(id, feed, success, error) {
				$http.put("/rssfeeds/" + id, feed).success(function(res) {
					success(res);
				}).error(error);
			},
			del: function(id, success, error) {
				$http.delete("/rssfeeds/" + id).success(function(res) {
					success(res);
				}).error(error);
			}

		};
	});
});