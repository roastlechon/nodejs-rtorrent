var logger = require('winston');
var _ = require('lodash');
var rtorrent = require('../lib/rtorrent');

function query(params) {

  // console.log('Requesting torrents from params:', params);

  var limit = params.limit;
  var begin = params.skip;
  var sortBy = params.sortBy;
  var filter = params.filter;
  var reverse = params.reverse;

  if (filter && 'hash' in filter) {
    return rtorrent.getTorrentsByHashes(filter.hash)
      .then(function (data) {
        return {
          data: data,
          total: data.length
        };
      });
  }

  return rtorrent.getTorrents()
    .then(function (data) {
      var listTotal = data.length;
      var list = _.sortBy(data, sortBy);

      if (filter) {

        if ('name' in filter) {
          list = _.filter(list, function (item) {
            return item.name.toLowerCase().indexOf(filter.name) > -1;
          });
        }

        if ('status' in filter) {
          if (filter.status.trim().length !== 0) {
            list = _.filter(list, {
              status: filter.status
            });
          }

        }

        listTotal = list.length;
      }

      if (reverse === true) {
        list = list.reverse();
      }
      list = _.map(list, function (item, index) {
              item.index = index;
              return item;
            });

      var end = (begin + limit) > list.length ? list.length : (begin + limit);
      var results = list.slice(begin, end);

      return {
        data: results,
        total: listTotal
      };
    });

}

module.exports = {
  query: query
};
