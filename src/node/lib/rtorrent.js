var xmlrpc = require("xmlrpc")
var portscanner = require("portscanner");
var logger = require("winston");
var Q = require("q");
var nconf = require("nconf");
var net = require('net');
var Deserializer = require('./rtorrent/deserializer');

function htmlspecialchars(str) {
	return str.replace(/\&/ig,"&amp;").replace(/\"/ig,"&quot;").replace(/\'/ig,"&#039;").replace(/\</ig,"&lt;").replace(/\>/ig,"&gt;");
}

if (!(nconf.get('rtorrent:option') === 'scgi' || nconf.get('rtorrent:option') === 'xmlrpc')) {
	var err = new Error('Config for rtorrent option is not valid. Please check config.json rtorrent.option property.');
	logger.error(err.message);
	throw err;
}

logger.info('Connect to rtorrent via', nconf.get('rtorrent:option'));

// need something to test connection to rtorrent first...

var client = xmlrpc.createClient({
	host: nconf.get("rtorrent:xmlrpc:host"),
	port: nconf.get("rtorrent:xmlrpc:port"),
	path: nconf.get("rtorrent:xmlrpc:path"),
	headers: {
		"User-Agent": "NodeJS XML-RPC Client",
		"Content-Type": "text/xml",
		"Accept": "text/xml",
		"Accept-Charset": "UTF8",
		"Connection": "Close"
	}
});

function scgiMethodCall(api, array) {
	var stream = net.connect(nconf.get("rtorrent:scgi:port"), nconf.get("rtorrent:scgi:host"));
	stream.setEncoding('UTF8');

	var deferred = Q.defer();

	var content = '<methodCall>';
	content += '<methodName>';
	content += api;
	content += '</methodName>';

	if (array.length > 0) {
		content += '<params>';
		for (var i = 0; i < array.length; i++) {
			content += '<param>';
			content += '<value>';
			content += htmlspecialchars('' + array[i]);
			content += '</value>';
			content += '</param>';
		};
		content += '</params>';
	}

	content += '</methodCall>';


	// length of data to transmit
	var length = 0;

	var head = [
		'CONTENT_LENGTH' + String.fromCharCode(0) + content.length + String.fromCharCode(0),
		'SCGI' + String.fromCharCode(0) + '1' + String.fromCharCode(0)
	];

	head.forEach(function (item) {
		length += item.length;
	});

	stream.write(length + ':');

	head.forEach(function (item) {
		stream.write(item);
	});

	stream.write(',');
	stream.write(content);

	var deserializer = new Deserializer('utf8');
	deserializer.deserializeMethodResponse(stream, function (err, data) {
		if (err) {
			return deferred.reject(err);
		}
		return deferred.resolve(data);
	});

	return deferred.promise;
}

function xmlrpcMethodCall (api, array) {
	var deferred = Q.defer();

	client.methodCall(api, array, function(err, data) {
		if (err) {
			return deferred.reject(err);
		}
		return deferred.resolve(data);
	});

	return deferred.promise;
}


var rtorrent = module.exports = {}

var upload_throttles = [];
var download_throttles = [];
var throttle_settings = [];



function methodCall (api, array) {

	if (nconf.get("rtorrent:option") === 'xmlrpc') {
		return xmlrpcMethodCall(api, array);
	}

	if (nconf.get("rtorrent:option") === 'scgi') {
		return scgiMethodCall(api, array);
	}
}

function initThrottle() {
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
		createThrottleSetting(throttle_settings[i]);
	}

	logger.info("Finished initializing throttle speeds");
}

function createThrottleSetting(throttleSetting) {
	var deferred = Q.defer();
	switch(throttleSetting.direction) {
		case "up": 
			rtorrent.throttleUp(throttleSetting.name + "", throttleSetting.up + "").then(function(data) {
				deferred.resolve(data);
			}, function(err) {
				deferred.reject(err);
			});
		break;
		case "down":
			rtorrent.throttleDown(throttleSetting.name + "", throttleSetting.up + "").then(function(data) {
				deferred.resolve(data);
			}, function(err) {
				deferred.reject(err);
			});
		break;
	}
	return deferred.promise;
}

// get_complete, is_open, is_hash_checking, get_state
// need to figure out better way of getting the status
function getStatus(value) {
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

function adaptTorrentArray(torrent) {
	return {
		name: torrent[0],
		hash: torrent[1],
		id: torrent[1],
		size: parseInt(torrent[2], 10),
		downloaded: parseInt(torrent[3], 10),
		uploaded: parseInt(torrent[12], 10),
		dl_speed: parseInt(torrent[4], 10),
		ul_speed: parseInt(torrent[5], 10),
		percent_downloaded: (torrent[3] / torrent[2]).toFixed(4),
		time_remaining: (torrent[2] - torrent[3]) / torrent[4],
		status: getStatus(torrent.slice(6, 10)),
		seeds: parseInt(torrent[10], 10),
		peers: parseInt(torrent[11], 10),
		total_peers: 0,
		total_seeds: 0
	}
}

rtorrent.init = function() {
	initThrottle();
}

rtorrent.setThrottle = function(hash, throttle_name) {
	var deferred = Q.defer();
	var pauseTorrent = rtorrent.pauseTorrent(hash);
	var setThrottle = pauseTorrent.then(function(data) {
		return rtorrent.setThrottleName(hash, throttle_name);
	}, function(err) {
		deferred.reject(err);
	});
	var startTorrent = setThrottle.then(function(data) {
		return rtorrent.startTorrent(hash);
	}, function(err) {
		deferred.reject(err);
	});

	startTorrent.then(function(data) {
		deferred.resolve(data);
	}, function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
}

rtorrent.throttleUp = function(name, value) {
	return methodCall("throttle_up", [name, value]);
}

rtorrent.throttleDown = function(name, value) {
	return methodCall("throttle_down", [name, value]);
}

rtorrent.setThrottleName = function(hash, throttle_name) {
	return methodCall("d.set_throttle_name", [hash, throttle_name]);
}

rtorrent.getTorrents = function() {
	var deferred = Q.defer();
	methodCall("d.multicall", ["main", "d.name=", "d.hash=", "d.size_bytes=", "d.bytes_done=", "d.get_down_rate=", "d.get_up_rate=", "d.get_complete=", "d.is_open=", "d.is_hash_checking=", "d.get_state=", "d.get_peers_complete=", "d.get_peers_accounted=", "d.get_up_total="]).then(function(data) {
		var torrents = data.map(function(torrent) {
			return adaptTorrentArray(torrent);
		});

		// Return empty array if no torrents exist in rtorrent.
		if (torrents.length === 0) {
			return deferred.resolve([]);
		}

		for (var i = torrents.length - 1; i >= 0; i--) {
			rtorrent.getScrapeIncomplete(torrents[i].hash).then(function(data) {
				var peersArray = data.map(function(value) {
					return parseInt(value, 10);
				});
				var peersInt = peersArray.reduce(function(a, b) {
					return a + b;
				}, 0);
				torrents[i].total_peers = peersInt;
			});
			rtorrent.getScrapeComplete(torrents[i].hash).then(function(data) {
				var seedsArray = data.map(function(value) {
					return parseInt(value, 10);
				});
				var seedsInt = seedsArray.reduce(function(a, b) {
					return a + b;
				}, 0);
				torrents[i].total_seeds = seedsInt;
			});
			return deferred.resolve(torrents);
		};
	}, function(err) {
		return deferred.reject(err);
	});
	
	return deferred.promise;
}

rtorrent.loadTorrentFile = function(filepath) {
	return methodCall("load", [filepath, "d.set_custom=x-filename"]);
}

rtorrent.loadTorrentUrl = function(url) {
	return methodCall("load_start", [url]);
}

rtorrent.startTorrent = function(hash) {
	return methodCall("d.start", [hash]).then(function(data) {
		return methodCall("d.resume", [hash]);
	}, function(err) {
		return Q.reject(err);
	});
}

rtorrent.stopTorrent = function(hash) {
	return methodCall("d.close", [hash]);
}

rtorrent.pauseTorrent = function(hash) {
	return methodCall("d.stop", [hash]);
}

rtorrent.removeTorrent = function(hash) {
	return methodCall("d.erase", [hash]);
}

rtorrent.getNetworkListenPort = function() {
	return methodCall("network.listen.port", []);
}

rtorrent.setPriority = function(priority) {
	return methodCall("d.set_priority", [hash, priority]);
}

// change to use nconf
rtorrent.getPortStatus = function(port) {
	var deferred = Q.defer();

	portscanner.checkPortStatus(port, "localhost", function(err, data) {
		if (err) {
			return deferred.reject(err);
		}
		
		return deferred.resolve(data);
	});

	return deferred.promise;
}

rtorrent.getScrapeIncomplete = function(hash) {
	return methodCall("t.multicall", [hash, "d.get_hash=", "t.get_scrape_incomplete="]);
}

rtorrent.getScrapeComplete = function(hash) {
	return methodCall("t.multicall", [hash, "d.get_hash=", "t.get_scrape_complete="]);
}

// get_port_range
// returns string of port range
rtorrent.getPortRange = function() {
	return methodCall('get_port_range', []);
}

// get_port_open
// returns 1 or 0
// Opens listening port
rtorrent.getPortOpen = function() {
	return methodCall('get_port_open', []);
}

rtorrent.getUploadSlots = function() {
	return methodCall('get_max_uploads', []);
}

rtorrent.getUploadSlotsGlobal = function() {
	return methodCall('get_max_uploads_global', []);
}

// get_port_random
// returns 1 or 0
// Randomize port each time rTorrent starts
rtorrent.getPortRandom = function() {
	return methodCall('get_port_random', []);
}

// get_download_rate
// returns value in bytes
//
rtorrent.getGlobalMaximumDownloadRate = function() {
	return methodCall('get_download_rate', []);
}

// set_download_rate
// requires value in bytes
//
rtorrent.setGlobalMaximumDownloadRate = function(value) {
	return methodCall('set_download_rate', [value]);
}

// get_upload_rate
// returns value in bytes
//
rtorrent.getGlobalMaximumUploadRate = function() {
	return methodCall('get_upload_rate', []);
}

// set_upload_rate
// requires value in bytes
rtorrent.setGlobalMaximumUploadRate = function(value) {
	return methodCall('set_upload_rate', [value]);
}