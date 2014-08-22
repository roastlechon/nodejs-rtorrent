var controllersModule = require("../controllers");
controllersModule.controller("AddTorrentController", ["$log", "$rootScope", "TorrentFactory", "$previousState",
	function($log, $rootScope, TorrentFactory, $previousState) {

		var logger = $log.getInstance("AddTorrentController");
		
		logger.debug("AddTorrentController loaded");
		
		var vm = this;

		vm.loadTorrent = function(url) {
			TorrentFactory.loadTorrent({
				"url": url
			}).then(function(data) {
				logger.debug(data);
				$previousState.go("modalInvoker");
			}, function(err) {
				console.log(err);
			});
		}

		vm.cancel = function() {
			$previousState.go("modalInvoker");
		}

	}
]);