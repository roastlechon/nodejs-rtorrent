module.exports = angular
	.module('torrents')
	.controller('TorrentsCtrl', function(njrtLog, $state, Torrents, Socket) {
		
		var logger = njrtLog.getInstance('torrents.TorrentsCtrl');
		
		logger.debug('TorrentsCtrl loaded.');

		var vm = this;

		vm.Torrents = Torrents;

		vm.predicate = 'name';
		vm.reverse = false;
		vm.status = '';
	});