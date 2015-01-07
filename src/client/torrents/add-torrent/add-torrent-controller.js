module.exports = angular
	.module('njrt.torrents.addTorrent')
	.controller('njrt.AddTorrentCtrl', ['njrtLog', '$state', '$previousState', 'njrt.Torrents', AddTorrentCtrl]);

function AddTorrentCtrl (njrtLog, $state, $previousState, Torrents) {

	var logger = njrtLog.getInstance('torrents.add');

	logger.debug('AddTorrentCtrl loaded.');

	var vm = this;

	vm.loadTorrent = function (url) {
		Torrents.load(url)
			.then(function (data) {
				logger.debug(data);
				$previousState.go('modalInvoker');
			}, function (err) {
				logger.error(err);
			});
	}

	vm.cancel = function () {
		$previousState.go('modalInvoker');
	}

}
