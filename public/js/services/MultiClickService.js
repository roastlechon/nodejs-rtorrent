define([
	"services"
], function(serviceModule) {
	"use strict";
	return serviceModule.service("MultiClickService", function() {
		
		var selectedList = [];
		
		this.toggleItem = function(item) {
			console.log("current list");
			console.log(selectedList);

			// loop through array
			for (var i = selectedList.length - 1; i >= 0; i--) {

				// if item exists in array, remove it
				if (selectedList[i].id === item.id) {
					console.log("removing item");
					selectedList.splice(i);
					console.log("list after");
					console.log(selectedList);
					return;
				}
			};

			console.log("adding item:");
			console.log(item);
			selectedList.push(item);

			console.log("list after");
			console.log(selectedList);
		}

		this.resetSelectedList = function() {
			selectedList = [];
		}

		this.getSelectedList = function() {
			return selectedList;
		}

	});
});