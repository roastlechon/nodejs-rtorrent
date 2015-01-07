var addTorrent = require('./add-torrent/add-torrent');
var deleteTorrentData = require('./delete-torrent-data/delete-torrent-data');
var viewTorrents = require('./view-torrents/view-torrents');

module.exports = angular
	.module('njrt.torrents', [
		addTorrent.name,
		deleteTorrentData.name,
		viewTorrents.name
	]);

require('./torrents-factory');