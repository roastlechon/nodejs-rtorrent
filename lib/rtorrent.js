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
  path: '/RPC2',
  headers: {
    'User-Agent'     : 'NodeJS XML-RPC Client',
    'Content-Type'   : 'text/xml',
    'Accept'         : 'text/xml',
    'Accept-Charset' : 'UTF8',
    'Connection'     : 'Close'
  }
});

var rtorrent = module.exports = {}

var resetClient = function() {
  logger.info(client);
  client = xmlrpc.createClient({
    host: '127.0.0.1',
    port: '80',
    path: '/RPC2'
  });
  logger.info(client);
}

var upload_throttles = [];
var download_throttles = [];
var throttle_settings = [];

rtorrent.init = function() {
  rtorrent.initThrottle();
}

rtorrent.initThrottle = function() {
  var throttleSpeed = 16;
  for (var i = 5 - 1; i >= 0; i--) {
    upload_throttles.push({
      display: "Up_" + throttleSpeed,
      name: "up_" + i,
      up: throttleSpeed,
      down: 0,
      direction: "up"
    });
    throttleSpeed = throttleSpeed * 2
  }
  var throttleSpeed = 16;
  for (var i = 5 - 1; i >= 0; i--) {
    download_throttles.push({
      display: "Down_" + throttleSpeed,
      name: "down_" + i,
      up: 0,
      down: throttleSpeed,
      direction: "down"
    });
    throttleSpeed = throttleSpeed * 2
  }

  throttle_settings = upload_throttles.concat(download_throttles);
  logger.info(throttle_settings);

  for (var i = throttle_settings.length - 1; i >= 0; i--) {
    rtorrent.createThrottleSetting(throttle_settings[i]);
  }

  logger.info("finished initializing throttle speeds");
}

rtorrent.createThrottleSetting = function(throttleSetting) {
  logger.info(throttleSetting);
  switch(throttleSetting.direction) {
    case "up": 
      var fields = [throttleSetting.name + "", throttleSetting.up + ""];
      client.methodCall("throttle_up", fields, function(err, val) {
        if (err) {
          logger.error("error occured while creating throttle settings");
          logger.error(err);
        } else {
          logger.info("set throttle setting");
        }
      });
    break;
    case "down":
      var fields = [throttleSetting.name + "", throttleSetting.down + ""];
      client.methodCall("throttle_down", fields, function(err, val) {
        if (err) {
          logger.error("error occured while creating throttle settings");
          logger.error(err);
        } else {
          logger.info("set throttle setting");
        }
      });
    break;
  }
}

rtorrent.setThrottle = function(hash, throttle_name, callback) {
  var fields = [hash, throttle_name];
  rtorrent.pauseTorrent(hash, function(err, res) {
    if (err) {
        logger.error("error occured stopping torrent");
        logger.error(err);
    } else {
      client.methodCall("d.set_throttle_name", fields, function(err, val) {
        if (err) {
          logger.error("error occured in set_throttle_name");
          logger.error(err);
          callback(err, null);
        } else {
          logger.info(val);
          rtorrent.startTorrent(hash, function(err, res) { 
            if (err) {
              callback(err, null);
            } else {
              callback(null, val);
            }
          });
        }
      });
    }
  });
}

rtorrent.getAll = function(callback) {
  var fields = ['main', 'd.name=', 'd.hash=', 'd.size_bytes=', 'd.bytes_done=', 'd.get_down_rate=', 'd.get_up_rate=', 'd.get_complete=', 'd.is_open=', 'd.is_hash_checking=', 'd.get_state=', 'd.get_peers_complete=', 'd.get_peers_accounted=', 'd.get_up_total='];
  client.methodCall('d.multicall', fields, function(err, torrents) {
    if (err) {
      logger.error("error occured in getAll");
      logger.error(err);
      logger.info("reseting client");
      resetClient();
    } else {
      getTorrents(torrents, function(list) {
        callback(list);
      });
    }
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

rtorrent.setPriority = function(priority, callback) {
  client.methodCall('d.set_priority', [hash, priority], function(error, status) {
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
          size: parseInt(torrent[2], 10),
          downloaded: parseInt(torrent[3], 10),
          uploaded: parseInt(torrent[12], 10),
          dl_speed: parseInt(torrent[4], 10),
          ul_speed: parseInt(torrent[5], 10),
          percent_downloaded: (torrent[3] * 100 / torrent[2]).toFixed(2),
          time_remaining: (torrent[2] - torrent[3]) / torrent[4],
          status: getStatus(torrent.slice(6, 10)),
          seeds: parseInt(torrent[10], 10),
          peers: parseInt(torrent[11], 10),
          total_peers: parseInt(results[0], 10),
          total_seeds: parseInt(results[1], 10)
        });
      }
    });
}