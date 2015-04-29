var logger = require('winston');
var CronJob = require('cron').CronJob;
var nconf = require('nconf');
var feedsModel = require('./feeds-model');
var feedParser = require('./feed-parser');

try {
  new CronJob(nconf.get('app:rssSubscriptionCronPattern'), function () {
    logger.info('Starting feeds CronJob');
    logger.info('Polling feeds');
    feedsModel.all()
      .then(function (data) {
        data.map(function (feed) {
          feedParser.getTorrents(feed);
        });

      }, function (err) {
        logger.error(err.message);
      });
  }, function () {
    logger.info('Finished feeds CronJob');
  }, true);
} catch(err) {
  logger.error('CronJob pattern is not valid');
}
