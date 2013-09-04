var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
var xmlrpc = require('xmlrpc')
var portscanner = require("portscanner");
var logger = require("winston");
var _ = require("underscore");
var async = require("async");
var client = xmlrpc.createClient({
  host: '127.0.0.1',
  port: '80',
  path: '/RPC2'
});

var rtorrent = module.exports = {}

rtorrent.getAll = function(callback) {
  var fields = ['main', 'd.name=', 'd.hash=', 'd.size_bytes=', 'd.bytes_done=', 'd.get_down_rate=', 'd.get_up_rate=', 'd.get_complete=', 'd.is_open=', 'd.is_hash_checking=', 'd.get_state=', 'd.get_peers_complete=', 'd.get_peers_accounted='];
  client.methodCall('d.multicall', fields, function(err, torrents) {
    logger.error("error occured in getAll");
    logger.error(err);
    getTorrents(torrents, function(list) {
      callback(list);
    });
  });
}

rtorrent.loadTorrentFile = function(filepath, callback) {
  client.methodCall('load', [filepath, 'd.set_custom=x-filename'], function(err, val) {
    callback(null, filepath);
  });
}

rtorrent.loadTorrentUrl = function(url, callback) {
  client.methodCall("load_start", [url], function(err, val) {
    callback(null, url);
  });
}

rtorrent.startTorrent = function(hash, callback) {
  client.methodCall('d.start', [hash], function(err, val) {
    client.methodCall('d.resume', [hash], function(err, val) {
      callback(null, hash)
    });
  })
}

rtorrent.stopTorrent = function(hash, callback) {
  client.methodCall('d.close', [hash], function(err, val) {
    callback(null, hash)
  })
}

rtorrent.pauseTorrent = function(hash, callback) {
  client.methodCall('d.stop', [hash], function(err, val) {
    callback(null, hash)
  })
}

rtorrent.removeTorrent = function(hash, callback) {
  client.methodCall('d.erase', [hash], function(err, val) {
    callback(null, hash)
  })
}

rtorrent.getNetworkListenPort = function(callback) {
  client.methodCall('network.listen.port', [], function(err, val) {
    callback(err, val);
  });
}

rtorrent.getPortStatus = function(port, callback) {
  portscanner.checkPortStatus(port, 'home.roastlechon.com', function(error, status) {
    callback(error, status);
  });
}

// get_complete, is_open, is_hash_checking, get_state
var getStatus = function(value) {
  if (value[0] === "1" && value[1] === "1" && value[2] === "0" && value[3] === "1") {
    return "seeding";
  } else if (value[0] === "1" && value[1] === "0" && value[2] === "0" && value[3] === "0") {
    return "finished";
  } else if (value[0] === "0" && value[1] === "1" && value[2] === "0" && value[3] === "1") {
    return "downloading";
  } else if (value[0] === "0" && value[1] === "0" && value[2] === "0" && value[3] === "1") {
    // stopped in the middle
    return "stopped";
  } else if (value[0] === "0" && value[1] === "0" && value[2] === "0" && value[3] === "0") {
    // i dont know stopped
    return "stopped";
  } else if (value[0] === "0" && value[1] === "1" && value[2] === "0" && value[3] === "0") {
    return "paused";
  } else if (value[0] === "1" && value[1] === "1" && value[2] === "0" && value[3] === "0") {
    // seeding pause
    return "paused";
  } else if (value[0] === "1" && value[1] === "0" && value[2] === "0" && value[3] === "1") {
    return "finished";
  } else if (value[2] === "1") {
    return "checking";
  }
}

var getSize = function(value) {
  var factor = 1,
    suffix = 'bytes',
    KB = 1024,
    MB = KB * 1024,
    GB = MB * 1024;
  if (value >= KB && value < MB) {
    factor = KB;
    suffix = 'KB';
  } else if (value >= MB && value < GB) {
    factor = MB;
    suffix = 'MB';
  } else if (value >= GB) {
    factor = GB;
    suffix = 'GB';
  }
  var num = ('' + value / factor).replace(/(\d+\.\d{0,2})\d*/, "$1");
  return [num, suffix].join(' ');
}

var getSpeed = function(value) {
  var factor = 1,
    suffix = 'bytes/s',
    KB = 1024,
    MB = KB * 1024,
    GB = MB * 1024;
  if (value >= KB && value < MB) {
    factor = KB;
    suffix = 'KB/s';
  } else if (value >= MB && value < GB) {
    factor = MB;
    suffix = 'MB/s';
  } else if (value >= GB) {
    factor = GB;
    suffix = 'GB/s';
  }
  var num = ('' + value / factor).replace(/(\d+\.\d{0,2})\d*/, "$1");
  return [num, suffix].join(' ');
}

var getPercent = function(value) {
  var num = ("" + value * 100).replace(/(\d+\.\d{0,2})\d*/, "$1");
  return [num, "%"].join('');
}

/*
  bytes/second * 
*/
var getTime = function(value) {

  if (!isFinite(value)) {
    return "n/a";
  }

  var suffix = "seconds",
    day = 86400,
    hr = 3600,
    min = 60;
  var seconds = parseInt(value, 10);
  var days = Math.floor(seconds / day);
  var hours = Math.floor((seconds - (days * day)) / hr);
  var minutes = Math.floor((seconds - (days * day) - (hours * hr)) / min);
  var seconds = seconds - (days * day) - (hours * hr) - (minutes * min);

  if (value >= min && value <= hr) {
    return [minutes, "minutes", seconds, "seconds"].join(" ");
  } else if (value >= hr && value <= day) {
    return [hours, "hours", minutes, "minutes", seconds, "seconds"].join(" ");
  } else if (value >= day) {
    return [days, "days", hours, "hours", minutes, "minutes", seconds, "seconds"].join(" ");
  }

}

var getTorrents = function(torrents, callback) {
  var list = [];

  function loopTorrents(i) {
    // check length of torrents
    // add timeout?

    if (i < torrents.length) {
      getTorrent(torrents[i], function(torrent) {
        list.push(torrent);
        // increment loopTorrents recursively
        loopTorrents(i + 1);
      });
    } else {
      // do callback when all torrents have been retrieved
      callback(list);
    }
  }
  // begin loopTorrents
  loopTorrents(0);
}

var getTorrent = function(torrent, callback) {
  // begin parallel asynchronous calls
  async.parallel([
      function(callback) {
        var fields = [torrent[1], 'd.get_hash=', 't.get_scrape_incomplete='];
        client.methodCall('t.multicall', fields, function(err, list) {
          // timeout
          if (err) {
            logger.error("error occured in first getTorrent asynchronous callback");
            logger.error(err);
            callback(err, null);
          } else {
            var list = list.map(function(value) {
              return parseInt(value, 10);
            });
            var value = list.reduce(function(a, b) {
              return a + b;
            }, 0);
            callback(null, value);
          }

        });
      },
      function(callback) {
        var fields = [torrent[1], 'd.get_hash=', 't.get_scrape_complete='];
        client.methodCall('t.multicall', fields, function(err, list) {
          if (err) {
            logger.error("error occured in second getTorrent asynchronous callback");
            logger.error(err);
            callback(err, null);
          } else {
            var list = list.map(function(value) {
              return parseInt(value, 10);
            });
            var value = list.reduce(function(a, b) {
              return a + b;
            }, 0);
            callback(null, value);
          }
        });
      }
    ],
    function(err, results) {
      if (err) {
        logger.error("error occured in parallel getTorrent");
        logger.error(err);
      } else {
        callback({
          name: torrent[0],
          hash: torrent[1],
          id: torrent[1],
          size: getSize(torrent[2]),
          downloaded: getSize(torrent[3]),
          dl_speed: getSpeed(torrent[4]),
          ul_speed: getSpeed(torrent[5]),
          percent_downloaded: getPercent(torrent[3] / torrent[2]),
          time_remaining: getTime((torrent[2] - torrent[3]) / torrent[4]),
          status: getStatus(torrent.slice(6, 10)),
          seeds: torrent[10],
          peers: torrent[11],
          total_peers: results[0],
          total_seeds: results[1]
        });
      }
    });
}