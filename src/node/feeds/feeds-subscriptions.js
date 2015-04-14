var logger = require('winston');
var nconf = require('nconf');
var feedsModel = require('./feeds-model');
var feedParser = require('./feed-parser');

setInterval(function () {
  logger.info('Polling feeds');
  feedsModel.all()
    .then(function (data) {
      data.map(function (feed) {
        feedParser.getTorrents(feed);
      });

    }, function (err) {
      logger.error(err.message);
    });
}, nconf.get('app:checkFeedLoopInterval'));
