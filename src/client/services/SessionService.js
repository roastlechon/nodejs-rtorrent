var serviceModule = require("../services");
serviceModule.service("SessionService", function($log, $rootScope, $state, $window) {

	// Restangular.setRestangularFields({
	// 	id: "_id"
	// });
	
	// return {
	// 	getFeeds: function() {
	// 		var feeds = Restangular.all("feeds");
	// 		return feeds.getList();

	// expects token, expires, id, email
	this.setUserSession = function(userSession) {
		this.isAuthenticated = true;
		this.userSession = $window.sessionStorage.userSession = userSession;
	}

	this.getUserSession = function() {
		return $window.sessionStorage.userSession;
	}
});