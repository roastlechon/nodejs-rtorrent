var logger = require('winston');
var Q = require('q');
var rtorrent = require('../lib/rtorrent');
var nconf = require('nconf');
var _ = require('lodash');

/**
 * torrents-model.js
 *
 * Model file that contains list of torrents from rtorrent.
 * Torrents stay up to date constantly. On client connection,
 * torrent loop is started. Client emits "torrents" with query
 * object. Server will emit back "torrents" as a result of query.
 *
 */

// var interval;
// rtorrent.getTorrents()
//       .then(function(data) {
//         exports.list = data;
//       }, function(err) {
//         logger.error(err.message);
//       });

// function startLoop() {
// 	logger.info('Starting torrent loop.');
// 	interval = setTimeout(function () {
// 		rtorrent.getTorrents()
// 			.then(function(data) {
// 				exports.list = data;
// 			}, function(err) {
// 				logger.error(err.message);
// 			});
// 	}, nconf.get('app:rtorrentLoopInterval'));
// }

// function stopLoop() {
// 	logger.info('Stopping torrent loop.');
// 	clearTimeout(interval);
// }

function query(params) {

  return rtorrent.getTorrents()
    .then(function (data) {
      var listTotal = data.length;
      var list = _.sortBy(data, params.sortBy);

      if (params.filter) {

        if ('name' in params.filter) {
          list = _.filter(list, function (item) {
            return item.name.toLowerCase().indexOf(params.filter.name) > -1;
          });
        }

        if ('status' in params.filter) {
          if (params.filter.status.trim().length !== 0) {
            list = _.filter(list, {
              status: params.filter.status
            });
          }

        }


        listTotal = list.length;
      }

      if (params.reverse === true) {
        list = list.reverse();
      }
      list = _.map(list, function (item, index) {
              item.index = index;
              return item;
            });

      console.log(params);
      var limit = params.limit;
      var begin = params.skip;
      var end = (begin + limit) > list.length ? list.length : (begin + limit);
      console.log(begin, end);
      var results = list.slice(begin, end);

      // var rest = _.rest(list, (params.skip - 1) * params.per_page)
      // var results = _.take(rest, params.per_page);

      // console.log(results);
      return {
        data: results,
        total: listTotal
      };
    });

}

function getTorrentsByHashes(hashes) {
  return rtorrent.getTorrentsByHashes(hashes);
}

function all() {
	// var deferred = Q.defer();

	// deferred.resolve(exports.list);

	// return deferred.promise;
}

exports.list = [];
// exports.startLoop = startLoop;
// exports.stopLoop = stopLoop;
exports.query = query;
exports.all = all;
exports.getTorrentsByHashes = getTorrentsByHashes;
