module.exports = angular
	.module('njrt.torrents.deleteTorrentData')
	.controller('njrt.DeleteTorrentDataCtrl', ['njrtLog', '$stateParams', '$previousState', '$modal', 'njrt.Torrents', 'torrent', DeleteTorrentDataCtrl]);

function DeleteTorrentDataCtrl (njrtLog, $stateParams, $previousState, $modal, Torrents, torrent) {

	var logger = njrtLog.getInstance('njrt.torrents');

	logger.debug('DeleteTorrentDataCtrl loaded.');

	var vm = this;

	vm.torrent = torrent;

	vm.deleteTorrentData = function (torrents) {

		// Get hashes from torrents array
		var hash = torrents.map(function (t) {
			return t.hash;
		});

		Torrents.deleteData(hash)
			.then(function (data) {
				$previousState.go('modalInvoker');
			}, function (err) {
				logger.error(err);
			});
	};

	vm.cancel = function () {
		$previousState.go('modalInvoker');
	};

}