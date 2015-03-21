var logger = require('winston');
var settings = require('./settings-model');

function allConnection(req, res, next) {
	settings.connection.all()
		.then(function (data) {
			logger.info('Successfully retrieved connection settings.');
			res.json(data);
		}, function (err) {
			next(err);
		});
}

function editConnection(req, res, next) {
	settings.connection.edit(req.body)
		.then(function(data) {
			logger.info('Successfully updated connection settings.');
			res.json(data);
		}, function(err) {
			next(err);
		});
}

function allDownload(req, res, next) {
	settings.download.all()
		.then(function (data) {
			logger.info('Successfully retrieved download settings.');
			res.json(data);
		}, function (err) {
			next(err);
		});
}

function editDownload(req, res, next) {
	settings.download.edit(req.body)
		.then(function(data) {
			logger.info('Successfully updated download settings.');
			res.json(data);
		}, function(err) {
			next(err);
		});
}

module.exports = function (router) {
	router.route('/settings/connection')
		.get(allConnection)
		.put(editConnection);

	router.route('/settings/download')
		.get(allDownload)
		.put(editDownload);
};