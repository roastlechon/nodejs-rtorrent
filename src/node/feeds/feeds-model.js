var logger = require('winston');

var Q = require('q');
var moment = require('moment');

// Mongoose Schemas
var Torrent = require('../models/schemas/torrent');
var Filter = require('../models/schemas/filter');
var Feed = require('../models/schemas/feed');

var notifications = require('../notifications/notifications-model');
//
var rtorrent = require('../lib/rtorrent');
var torrentFeedParser = require('../lib/torrent-feed-parser');

var socket = require('../controllers/socket');

exports.all = function () {
	return Feed
		.find({})
		.select('-torrents -__v')
		.sort({
			'title': 'ascending'
		})
		.exec();
};

exports.one = function (id) {
	return Feed
		.findOne({
			'_id': id
		})
		.exec()
			.then(function (data) {
				if (!data) {
					throw new Error('Feed does not exist.');
				}

				return data;
			});
};

exports.edit = function(id, feed) {

	return Feed
		.findOne({
			'_id': id
		})
		.select('-torrents -__v')
		.exec()
			.then(function (data) {
				if (!data) {
					throw new Error('Feed does not exist.');
				}

				// Update feed by reparsing data
				return torrentFeedParser.getTorrents(feed)
					.then(function (data) {
						feed.torrents = [];
						for (var i = 0; i < data.length; i++) {
							var torrent = new Torrent({
								name: data[i].name,
								url: data[i].url,
								status: 'RSS',
								date: data[i].date
							});
							feed.torrents.push(torrent);
						};

						return Feed.update({
							'_id': id
						}, feed).exec();
					});
			});
};

exports.add = function(feed) {

	return Feed
		.findOne({
			'rss': feed.rss
		})
		.select('-torrents -__v')
		.exec()
			.then(function(data) {

				if (!data) {
					logger.info('Feed does not exist.');
					return torrentFeedParser.getTorrents(feed);
				}

				throw new Error('Feed exists.');
			})
			.then(function(data) {
				logger.info('Getting torrents from feed.');

				var feedModel = new Feed({
					title: feed.title,
					path: feed.path,
					lastChecked: moment().unix(),
					rss: feed.rss,
					autoDownload: feed.autoDownload,
					filters: [],
					torrents: []
				});
				
				for (var i = 0; i < feed.filters.length; i++) {
					var filter = new Filter({
						regex: feed.filters[i].regex,
						type: feed.filters[i].type
					});
					feedModel.filters.push(filter);
				};

				if (data) {
					for (var i = 0; i < data.length; i++) {
						var torrent = new Torrent({
							name: data[i].name,
							url: data[i].url,
							status: 'RSS',
							date: data[i].date
						});
						feedModel.torrents.push(torrent);
					};
				}

				logger.info('Saving feed to database.');

				return Feed.create(feedModel);
			});
};

exports.del = function (id) {

	// Cannot use findOneAndRemove due to incompatibility with Tingus/TingoDB
	return Feed.findOne({
		'_id': id
	})
	.select('-torrents -__v')
	.exec()
		.then(function (data) {

			// If document does not exist throw an error.
			if (!data) {
				throw new Error('Feed does not exist.');
			}

			// If document exists, return remove promise.
			return Feed.remove({
				'_id': id
			}).exec();
		});
};

exports.refresh = function (id) {
	return Feed.findOne({
		'_id': id
	})
	.select('-torrents -__v')
	.exec()
		.then(function (data) {

			// If document does not exist throw an error.
			if (!data) {
				throw new Error('Feed does not exist.');
			}

			return torrentFeedParser.getTorrents(data)

				.then(function (data) {
					var torrents = [];
					
					for (var i = 0; i < data.length; i++) {
						var torrent = new Torrent({
							name: data[i].name,
							url: data[i].url,
							status: 'RSS',
							date: data[i].date
						});
						torrents.push(torrent);
					};

					return Feed.update({
						'_id': id
					}, {
						torrents: torrents
					}).exec();
				});
		});
};





exports.addTorrent = function(_id, torrent, autoDownload) {

	var torrentFeed = new Torrent({
		name: torrent.name,
		url: torrent.url,
		status: 'RSS',
		date: torrent.date
	});

	return Feed
		.findOne({
			'_id': _id,
			'torrents.url': torrent.url
		})
		.select('-torrents -__v')
		.exec()
			.then(function (data) {

				// If torrent does not exist, continue to add torrent 
				// and auto download if available
				if (!data) {
					return Feed
						.findOne({
						'_id': _id
					})
					.exec()
						.then(function (data) {
							if (!data) {
								throw new Error ('Feed does not exist.');
							}

							// If autoDownload is true, start the torrent automatically
							if (autoDownload) {

								var tor = {
									url: torrent.url
								};

								// If path is set, set path on tor
								if (data.path.length > 0) {
									tor.path = data.path;
								} 

								rtorrent.loadTorrent(tor).then(function() {
									notifications.add({type: 'success', message: 'Automatically loaded torrent ' + tor.url});
								});

							}

							data.torrents.push(torrentFeed);
							data.save(function(err, doc) {
								notifications.add({type: 'success', message: 'New torrent saved in feed ' + data.title});
							});

							return Feed
								.update({
									'_id': _id
								}, {
									'lastChecked': moment().unix()
								})
								.exec();
						});
				}

				throw new Error('Torrent exists in feed already.');
			});
};