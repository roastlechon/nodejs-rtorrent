var logger = require('winston');
var feeds = require('./feeds-model');

// Get all feeds.
function all(req, res, next) {
	feeds.all()
		.then(function (data) {
			logger.info('Successfully retrieved feeds.');
			res.json(data);
		}, function (err) {
			next(err);
		});
}

// Get a single feed based on id.
function one(req, res, next) {
	feeds.one(req.params.id)
		.then(function (data) {
			logger.info('Successfully retrieved feed', req.params.id);
			res.json(data);
		}, function (err) {
			if (err.message == 'Feed does not exist.') {
				res.status(404).send(err.message);
			}

			next(err);
		});
}

// Add feed based on JSON body.
function add(req, res, next) {
	feeds.add(req.body)
		.then(function (data) {
			logger.info('Successfully saved feed', req.body.rss);
			res.json(data);
		}, function (err) {
			next(err);
		});
}

// Edit feed based on id and JSON body.
function edit(req, res, next) {
	feeds.edit(req.params.id, req.body)
		.then(function (data) {
			logger.info('Successfully updated feed', req.params.id);
			res.json(data);
		}, function (err) {
			if (err.message == 'Feed does not exist.') {
				res.status(404).send(err.message);
			}
			
			next(err);
		});
}

// Delete feed based on id.
function del(req, res, next) {
	feeds.del(req.params.id)
		.then(function (data) {
			logger.info('Successfully deleted feed', req.params.id);
			res.json(data);
		}, function (err) {
			if (err.message == 'Feed does not exist.') {
				res.status(404).send(err.message);
			}

			next(err);
		});
}

// Refresh feed based on id.
function refresh(req, res, next) {
	feeds.refresh(req.params.id)
		.then(function (data) {
			logger.info('Successfully refreshed feed', req.params.id);
			res.json(data);
		}, function (err) {
			if (err.message == 'Feed does not exist.') {
				res.status(404).send(err.message);
			}

			next(err);
		});
}

// Route module for feeds. Takes an Express router object as a parameter.
// Eg. express.Router()
module.exports = function (router) {
	router.route('/feeds')
		.get(all)
		.post(add);

	router.route('/feeds/:id')
		.get(one)
		.put(edit)
		.delete(del);

	router.route('/feeds/:id/refresh')
		.post(refresh);
};