var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
var xmlrpc = require('xmlrpc')
var portscanner = require("portscanner");
var client = xmlrpc.createClient({host: '127.0.0.1', port: '80', path: '/RPC2'})

var rtorrent = module.exports = {}

var torrent = function(t) {
  return {
        "name" : t[0],
        "hash" : t[1],
        "size" : getSize(t[2]),
        "downloaded" : getSize(t[3]),
        "dl_speed" : getSpeed(t[4]),
        "ul_speed" : getSpeed(t[5]),
        "percent_downloaded" : getPercent(t[3]/t[2]),
        "time_remaining" : getTime((t[2] - t[3]) / t[4]),
        "status" : getStatus(t.slice(6, 9)),
        "seeds" : t[9],
        "peers" : t[10]
    }
}

rtorrent.getAll = function(callback) {
  var fields = ['main', 'd.name=', 'd.hash=', 'd.size_bytes=', 'd.bytes_done=', 'd.get_down_rate=', 'd.get_up_rate=', 'd.get_complete=', 'd.is_open=', 'd.is_hash_checking=', 'd.get_peers_complete=', 'd.get_peers_accounted='];
  client.methodCall('d.multicall', fields, function(err, torrents) {
    var list = torrents.map(torrent);
    callback(list);
  });
}

rtorrent.getTotalPeers = function(hash, callback) {
  var fields = [hash, 'd.get_hash=', 't.get_scrape_incomplete='];
  client.methodCall('t.multicall', fields, function(err, list) {
    var list = list.map(function(value) {
      return parseInt(value, 10);
    });
    callback(null, list);
  });
}

rtorrent.getTotalSeeds = function(hash, callback) {
  var fields = [hash, 'd.get_hash=', 't.get_scrape_complete='];
  client.methodCall('t.multicall', fields, function(err, list) {
    var list = list.map(function(value) {
      return parseInt(value, 10);
    });
    callback(null, list);
  });
}

rtorrent.addNewRaw = function(data, callback) {
  var writeFile = function(data, cb){
    var md5 = crypto.createHash('md5')
    var filename = path.join('/tmp', md5.update(data).digest('hex') + '.torrent')
    fs.writeFile(filename, data, function(err){
      if (err) throw err;
      cb(filename)
    })
  }
  var loadTorrentFile = function(cb){
    return function(filename){
      client.methodCall('load', [filename, 'd.set_custom=x-filename'], function(err, val) {
        if (err) return cb(err);
        cb(null, val);
      })
    }
  }
  writeFile(data, loadTorrentFile(callback))
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
  client.methodCall('d.start', [hash], function(err, val){
    callback(null, hash)
  })
}

rtorrent.resumeTorrent = function(hash, callback) {
  client.methodCall('d.resume', [hash], function(err, val){
    callback(null, hash)
  })
}

rtorrent.stopTorrent = function(hash, callback) {
  client.methodCall('d.close', [hash], function(err, val){
    callback(null, hash)
  })
}

rtorrent.pauseTorrent = function(hash, callback) {
  client.methodCall('d.stop', [hash], function(err, val){
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

var getStatus = function(value) {
  if (value[0] === "1" && value[1] === "1") {
    return "seeding";
  } else if (value[0] === "1" && value[1] === "0" && value[2] === "0") {
    return "finished";
  } else if (value[0] === "0" && value[1] === "1" && value[2] === "0") {
    return "downloading";
  } else if (value[0] === "0" && value[1] === "0" && value[2] === "0") {
    return "stopped";
  } else if (value[2] === "1") {
    return "checking";
  }
}

var getSize = function(value) {
  var factor = 1, suffix ='bytes', KB = 1024, MB = KB*1024, GB = MB*1024;
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
  var num = ('' + value/factor).replace(/(\d+\.\d{0,2})\d*/, "$1");
  return [num, suffix].join(' ');
}

var getSpeed = function(value) {
  var factor = 1, suffix ='bytes/s', KB = 1024, MB = KB*1024, GB = MB*1024;
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
  var num = ('' + value/factor).replace(/(\d+\.\d{0,2})\d*/, "$1");
  return [num, suffix].join(' ');
}

var getPercent = function(value) {
  var num = ("" + value * 100).replace(/(\d+\.\d{0,2})\d*/, "$1");
  return [num, "%"].join(' ');
}

/*
  bytes/second * 
*/
var getTime = function(value) {

  if (!isFinite(value)) {
    return "n/a";
  }

  var suffix = "seconds", day = 86400, hr = 3600, min = 60;
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
