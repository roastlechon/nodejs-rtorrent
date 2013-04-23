var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
var xmlrpc = require('xmlrpc')
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
        "status" : getStatus(t.slice(6, 9))
    }
}

rtorrent.getAll = function(callback) {
  var fields = ['main', 'd.name=', 'd.hash=', 'd.size_bytes=', 'd.bytes_done=', 'd.get_down_rate=', 'd.get_up_rate=', 'd.get_complete=', 'd.is_open=', 'd.is_hash_checking='];
  client.methodCall('d.multicall', fields, function(err, torrents) {
    console.log(torrents);
    var list = torrents.map(torrent);
    console.log(list);
    return callback(list);
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

rtorrent.startDownload = function(id, callback){
  client.methodCall('d.start', [id], function(err, val){
    callback(null, id)
  })
}

var getStatus = function(value) {
  console.log(value);
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
