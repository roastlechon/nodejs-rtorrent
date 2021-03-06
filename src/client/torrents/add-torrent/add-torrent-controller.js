module.exports = angular
	.module('njrt.torrents.addTorrent')
	.controller('njrt.AddTorrentCtrl', ['njrtLog', '$state', '$previousState', 'njrt.Torrents', '$scope', 'downloadSettings', AddTorrentCtrl]);

function AddTorrentCtrl (njrtLog, $state, $previousState, Torrents, $scope, downloadSettings) {

	var logger = njrtLog.getInstance('torrents.add');

	logger.debug('AddTorrentCtrl loaded.');

	var vm = this;

	vm.torrent = {
		url: '',
		path: ''
	};

	vm.defaultDownloadPath = downloadSettings.download_directory;

	vm.loadTorrent = function (torrent) {
		Torrents.load(torrent)
			.then(function (data) {
				logger.debug(data);
				$previousState.go('modalInvoker');
			}, function (err) {
				logger.error(err);
			});
	}

	vm.fileSelected = function ($files, $event) {
		vm.torrent.file = $files[0];
	};

	vm.cancel = function () {
		$previousState.go('modalInvoker');
	}

}
