module.exports = angular
	.module('torrents')
	.factory('Torrents', function (Restangular) {

		var Torrents = {};

		Torrents.start = function (hash) {
			var torrent = Restangular.one('torrents', hash);
			return torrent.post('start', {});
		}

		Torrents.pause = function (hash) {
			var torrent = Restangular.one('torrents', hash);
			return torrent.post('pause', {});
		}

		Torrents.stop = function (hash) {
			var torrent = Restangular.one('torrents', hash);
			return torrent.post('stop', {});
		}

		Torrents.remove = function (hash) {
			var torrent = Restangular.one('torrents', hash);
			return torrent.post('remove', {});	
		}

		Torrents.load = function (url) {
			var torrent = Restangular.all('torrents');
			return torrent.customPOST(url, 'load');
		}

		// {
		// 	action: 'setChannel',
		// 	hash: hash,
		// 	channel: channel
		// }
		Torrents.setChannel = function (hash) {
			
		}

		return Torrents;
	});