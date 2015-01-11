var logger = require('winston');
var auth = require('./auth');
var settings = require('../models/settings');

module.exports = function(app) {
	app.get('/settings/connection', auth.ensureAuthenticated, getConnectionSettings);
	app.put('/settings/connection', auth.ensureAuthenticated, updateConnectionSettings);
	app.get('/settings/download', auth.ensureAuthenticated, getDownloadSettings);
	app.put('/settings/download', auth.ensureAuthenticated, updateDownloadSettings);
}

function getConnectionSettings(req, res) {
	settings.getConnectionSettings()
		.then(function (data) {
			logger.info('Successfully retrieved connection settings.');
			res.json(data);
		}, function (err) {
			logger.error(err.message);
			res.status(500).send(err.message);
		});
}

function updateConnectionSettings(req, res) {
	settings.updateConnectionSettings(req.body)
		.then(function(data) {
			logger.info('Successfully updated connection settings.');
			res.json(data);
		}, function(err) {
			logger.error(err.message);
			res.status(500).send(err.message);
		}); 
}

function getDownloadSettings(req, res) {
	settings.getDownloadSettings()
		.then(function (data) {
			logger.info('Successfully retrieved download settings.');
			res.json(data);
		}, function (err) {
			logger.error(err.message);
			res.status(500).send(err.message);
		});
}

function updateDownloadSettings(req, res) {
	settings.updateDownloadSettings(req.body)
		.then(function(data) {
			logger.info('Successfully updated download settings.');
			res.json(data);
		}, function(err) {
			logger.error(err.message);
			res.status(500).send(err.message);
		}); 
}