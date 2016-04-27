/*jshint -W079 */
var xmlrpc = require('xmlrpc');
var Promise = require('bluebird');
var scgi = require('./scgi');
var fs = require('fs');
var path = require('path');
var readTorrent = require('read-torrent');
var Torrent = require('./models/torrent');

var RTorrent = function (config) {
  var _this = this;
  this.methodCall = undefined;
  this.client = undefined;
  this.config = config;

  if (!this.config) {
    throw Error('Config not passed');
  }

  if (!this.config.type || !(this.config.type === 'xmlrpc' || this.config.type === 'scgi')) {
    throw Error('Invalid config type');
  }

  if (!this.config.host || !this.config.port) {
    throw Error('Invalid config options');
  }

  if (this.config.type === 'xmlrpc' && !this.config.path) {
    throw Error('Invalid config options');
  }

  if (this.config.type === 'xmlrpc') {
    this.methodCall = function (api, array) {
      var _this = this;
      // console.log('Method Call:', api, 'Array:', array);

      if (!_this.client) {
        _this.client = xmlrpc.createClient({
            host: _this.config.host,
            port: _this.config.port,
            path: _this.config.path,
            headers: {
              'User-Agent': 'NodeJS XML-RPC Client',
              'Content-Type': 'text/xml',
              'Accept': 'text/xml',
              'Accept-Charset': 'UTF8',
              'Connection': 'Close'
            }
        });
      }

      var methodCall = Promise.promisify(_this.client.methodCall);
      return methodCall(api, array);
    };
  }

  if (this.config.type === 'scgi') {
    this.methodCall = function (api, array) {
      // console.log('Method Call:', api, 'Array:', array);
      return scgi(_this.config).call(api, array);
    };
  }

};

RTorrent.prototype.getTorrents = function () {
  var _this = this;
  return this.methodCall('d.multicall', ['main', 'd.name=', 'd.hash=', 'd.size_bytes=', 'd.bytes_done=',
    'd.get_down_rate=', 'd.get_up_rate=', 'd.get_complete=', 'd.is_open=', 'd.is_hash_checking=',
    'd.get_state=', 'd.get_peers_complete=', 'd.get_peers_accounted=', 'd.get_up_total='])
      .then(function (data) {
        if (!data || data.length === 0) {
          return [];
        }

        var torrents = data.map(function (item) {
          var torrent = new Torrent(item);
          return torrent;
        });

        // Declare multical array specifically for getting torrent data
        var systemMultiCallArray = [];

        // Loop through torrents from main call and push method call to get peers and seeds
        // Note: The order in which it is pushed matters. The returned array from rtorrent will be
        // an array of array of array of array of values
        torrents.forEach(function (torrent) {

          // Push peers first for the torrent
          systemMultiCallArray.push({
            methodName: 't.multicall',
            params: [torrent.hash, 'd.get_hash=', 't.get_scrape_incomplete=']
          });

          // Push seeds second for the torrent
          systemMultiCallArray.push({
            methodName: 't.multicall',
            params: [torrent.hash, 'd.get_hash=', 't.get_scrape_complete=']
          });
        });

        // Do the system.multicall and return promise
        // Inside the resolve function, we loop through the array
        return _this.methodCall('system.multicall', [systemMultiCallArray])
          .then(function (data) {
              var numberArray = [];

              // The length of data should be equal to the length of systemMultiCallArray
              data.forEach(function (item) {
                // Each item in the array has an array of arrays
                 item.forEach(function (itemagain) {
                  // Map and reduce the array to get the number
                  var number = itemagain.map(function (value) {
                      return parseInt(value, 10);
                    })
                    .reduce(function (a, b) {
                      return a + b;
                    }, 0);
                  // Push the number to a clean array so that we can place it correctly back into
                  // the torrent object to return to client
                  numberArray.push(number);
                });
              });

              // Map torrents and shift from numberArray to get the correct order
              // Peers is first, followed by seeds.
              // Return each torrent and finally return torrents back to caller.
              return torrents.map(function (torrent) {
                torrent.totalPeers = numberArray.shift();
                torrent.totalSeeds = numberArray.shift();
                return torrent;
              });
          });
      });
};

RTorrent.prototype.setThrottleName = function (hash, throttleName) {
  return this.methodCall('d.set_throttle_name=', [hash, throttleName]);
};

// Loads torrent and returns hash. Retries 10 times and throws error if
// unable to get hash
RTorrent.prototype.load = function (path) {
  var _this = this;
  return this.methodCall('load', [path])
    .then(function () {
      return _this.getTorrentMetaData(path);
    })
    .then(function (data) {
      var hash = data.infoHash.toUpperCase();
      var breakCount = 9;
      return _getHash(hash);


      function _getHash() {
        return _this.getHash(hash)
          .catch(function () {
            if (breakCount === 0) {
              throw new Error('Unable to get hash after 10 tries');
            }

            breakCount--;
            return _getHash();
          });
      }
    });
};

RTorrent.prototype.loadUrl = function (url) {
  return this.methodCall('load_start', [url]);
};

RTorrent.prototype.getHash = function (hash) {
  return this.methodCall('d.get_hash', [hash]);
};

//
RTorrent.prototype.getTorrentMetaData = function (url) {
  return new Promise(function (resolve, reject) {
    readTorrent(url, {}, function (err, data) {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });

  });
};

RTorrent.prototype.setDirectory = function (hash, path) {
  return this.methodCall('d.set_directory', [hash, path]);
};

RTorrent.prototype.start = function (hash) {
  return this.methodCall('d.start', [hash]);
};

RTorrent.prototype.resume = function (hash) {
  return this.methodCall('d.resume', [hash]);
};

RTorrent.prototype.startTorrent = function (hash) {
  var _this = this;
  return _this.start(hash)
    .then(function () {
      return _this.resume(hash);
    });
};

RTorrent.prototype.close = function (hash) {
  return this.methodCall('d.close', [hash]);
};

RTorrent.prototype.stopTorrent = function (hash) {
  var _this = this;
  return _this.close(hash);
};

RTorrent.prototype.stop = function (hash) {
  return this.methodCall('d.stop', [hash]);
};

RTorrent.prototype.pauseTorrent = function (hash) {
  var _this = this;
  return _this.stop(hash);
};

RTorrent.prototype.erase = function (hash) {
  return this.methodCall('d.erase', [hash]);
};

RTorrent.prototype.removeTorrent = function (hash) {
  var _this = this;
  return _this.erase(hash);
};

RTorrent.prototype.getTorrentName = function (hash) {
  return this.methodCall('d.get_name', [hash]);
};

RTorrent.prototype.getBasePath = function (hash) {
  return this.methodCall('d.get_base_path', [hash]);
};

RTorrent.prototype.isMultiFile = function (hash) {
  return this.methodCall('d.is_multi_file', [hash]);
};

RTorrent.prototype.getTorrentDirectory = function (hash) {
  return this.methodCall('d.get_directory', [hash]);
};

// Load torrent based on url
RTorrent.prototype.loadTorrent = function (url, filepath) {
  var _this = this;
  if (!filepath) {
    return _this.loadUrl(url);
  }

  return checkPathExists(filepath)
    .then(function (exists) {
      // Path exists
      if (exists) {
        return _this.load(url);
      }

      // Path does not exist
      var absolutepath = path.join('/', filepath);

      return makeDirectory(absolutepath)
        .then(function () {
          return _this.load(url);
        });
    })
    .then(function (hash) {
      return _this.setDirectory(hash, filepath)
        .then(function () {
          return _this.startTorrent(hash);
        });
    })
    .catch(function (err) {
      if (err.code === 'EACCES') {
        throw new Error('Unable to create directory', filepath, ' for torrent ', url, ' due to permissions.');
      }

      throw err;
    });
};

function checkPathExists(path) {
  return new Promise (function (resolve) {
    fs.exists(path, function (exists) {
      if (exists) {
        return resolve(exists);
      }

      return resolve(false);
    });
  });
}

function makeDirectory(path) {
  return new Promise (function (resolve, reject) {
    fs.mkdir(path, function (err, data) {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  });
}

RTorrent.prototype.getNetworkListenPort = function () {
  return this.methodCall('network.listen.port', []);
};

RTorrent.prototype.setPriority = function (priority) {
  return this.methodCall('d.set_priority', [priority]);
};

RTorrent.prototype.getScrapeIncomplete = function (hash) {
  return this.methodCall('t.multicall', [hash, 'd.get_hash=', 't.get_scrape_incomplete=']);
};

RTorrent.prototype.getScrapeComplete = function (hash) {
  return this.methodCall('t.multicall', [hash, 'd.get_hash=', 't.get_scrape_complete=']);
};

RTorrent.prototype.getTotalPeers = function (hash) {
  var _this = this;
  return _this.getScrapeIncomplete(hash)
    .then(function (data) {
      return data.map(function (value) {
        return parseInt(value, 10);
      })
      .reduce(function (a, b) {
        return a + b;
      }, 0);
    });
};

RTorrent.prototype.getTotalSeeds = function (hash) {
  var _this = this;
  return _this.getScrapeComplete(hash)
    .then(function (data) {
      return data.map(function (value) {
        return parseInt(value, 10);
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
    });
};

RTorrent.prototype.getPortRange = function () {
  return this.methodCall('get_port_range', [])
    .then(function (data) {
      return {
        'port_range': data
      };
    });
};

RTorrent.prototype.setPortRange = function (value) {
  return this.methodCall('set_port_range', [value]);
};

// get_port_open
// returns 1 or 0
// Opens listening port
RTorrent.prototype.getPortOpen = function () {
  return this.methodCall('get_port_open', [])
    .then(function (data) {
      return {
        'port_open': data === 1 ? true : false
      };
    });
};

RTorrent.prototype.setPortOpen = function (value) {
  return this.methodCall('set_port_open', [value]);
};

RTorrent.prototype.getUploadSlots = function () {
  return this.methodCall('get_max_uploads', [])
    .then(function (data) {
      return {
        'max_uploads': data
      };
    });
};

RTorrent.prototype.setUploadSlots = function (value) {
  return this.methodCall('set_max_uploads', [value]);
};

RTorrent.prototype.getUploadSlotsGlobal = function () {
  return this.methodCall('get_max_uploads_global', [])
    .then(function (data) {
      return {
        'max_uploads_global': data
      };
    });
};

RTorrent.prototype.setUploadSlotsGlobal = function (value) {
  return this.methodCall('set_max_uploads_global', [value]);
};

RTorrent.prototype.getDownloadSlotsGlobal = function () {
  return this.methodCall('get_max_downloads_global', [])
    .then(function (data) {
      return {
        'max_downloads_global': data
      };
    });
};

RTorrent.prototype.setDownloadSlotsGlobal = function (value) {
  return this.methodCall('set_max_downloads_global', [value]);
};

// get_port_random
// returns 1 or 0
// Randomize port each time RTorrent.prototype starts
RTorrent.prototype.getPortRandom = function () {
  return this.methodCall('get_port_random', [])
    .then(function (data) {
      return {
        'port_random': data === 1 ? true : false
      };
    });
};

RTorrent.prototype.setPortRandom = function (value) {
  return this.methodCall('set_port_random', [value]);
};

// get_download_rate
// returns value in bytes
RTorrent.prototype.getGlobalMaximumDownloadRate = function () {
  return this.methodCall('get_download_rate', [])
    .then(function (data) {
      return {
        'global_max_download_rate': data
      };
    });
};

// set_download_rate
// requires value in bytes
RTorrent.prototype.setGlobalMaximumDownloadRate = function (value) {
  return this.methodCall('set_download_rate', [value]);
};

// get_upload_rate
// returns value in bytes
RTorrent.prototype.getGlobalMaximumUploadRate = function () {
  return this.methodCall('get_upload_rate', [])
    .then(function (data) {
      return {
        'global_max_upload_rate': data
      };
    });
};

RTorrent.prototype.getMinNumberPeers = function () {
  return this.methodCall('get_min_peers', [])
    .then(function (data) {
      return {
        'min_peers': data
      };
    });
};

RTorrent.prototype.setMinNumberPeers = function (value) {
  return this.methodCall('set_min_peers', [value]);
};

RTorrent.prototype.getMinNumberSeeds = function () {
  return this.methodCall('get_min_peers_seed', [])
    .then(function (data) {
      return {
        'min_seeds': data
      };
    });
};

RTorrent.prototype.setMinNumberSeeds = function (value) {
  return this.methodCall('set_min_peers_seed', [value]);
};

RTorrent.prototype.getMaxNumberPeers = function () {
  return this.methodCall('get_max_peers', [])
    .then(function (data) {
      return {
        'max_peers': data
      };
    });
};

RTorrent.prototype.setMaxNumberPeers = function (value) {
  return this.methodCall('set_max_peers', [value]);
};

RTorrent.prototype.getMaxNumberSeeds = function () {
  return this.methodCall('get_max_peers_seed', [])
    .then(function (data) {
      return {
        'max_seeds': data
      };
    });
};

RTorrent.prototype.setMaxNumberSeeds = function (value) {
  return this.methodCall('set_max_peers_seed', [value]);
};

// set_upload_rate
// requires value in bytes
RTorrent.prototype.setGlobalMaximumUploadRate = function (value) {
  return this.methodCall('set_upload_rate', [value]);
};

RTorrent.prototype.getDownloadDirectory = function () {
  return this.methodCall('get_directory', [])
    .then(function (data) {
        return {
          'download_directory': data
        };
      });
};

RTorrent.prototype.setDownloadDirectory = function (value) {
  return this.methodCall('set_directory', [value]);
};

module.exports = RTorrent;
