var xmlrpc = require('xmlrpc')
var portscanner = require('portscanner');
var logger = require('winston');
var Q = require('q');
var nconf = require('nconf');
var net = require('net');
var rimraf = require('rimraf');
var Deserializer = require('./rtorrent/deserializer');
var Serializer = require('./rtorrent/serializer');

function htmlspecialchars(str) {
	return str.replace(/\&/ig,'&amp;').replace(/\'/ig,'&quot;').replace(/\'/ig,'&#039;').replace(/\</ig,'&lt;').replace(/\>/ig,'&gt;');
}

if (!(nconf.get('rtorrent:option') === 'scgi' || nconf.get('rtorrent:option') === 'xmlrpc')) {
	var err = new Error('Config for rtorrent option is not valid. Please check config.json rtorrent.option property.');
	logger.error(err.message);
	throw err;
}

logger.info('Connect to rtorrent via', nconf.get('rtorrent:option'));

// need something to test connection to rtorrent first...

function scgiMethodCall(api, array) {
	var stream = net.connect(nconf.get('rtorrent:scgi:port'), nconf.get('rtorrent:scgi:host'));
	stream.setEncoding('UTF8');

	var deferred = Q.defer();

	var xml = Serializer.serializeMethodCall(api, array);

	// length of data to transmit
	var length = 0;

	var head = [
		'CONTENT_LENGTH' + String.fromCharCode(0) + xml.length + String.fromCharCode(0),
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
	stream.write(xml);

	var deserializer = new Deserializer('utf8');
	deserializer.deserializeMethodResponse(stream, function (err, data) {

		if (err) {
			console.log(err);
			return deferred.reject(err);
		}
		return deferred.resolve(data);
	});

	return deferred.promise;
}

function xmlrpcMethodCall (api, array) {
	var deferred = Q.defer();

	var client = xmlrpc.createClient({
		host: nconf.get('rtorrent:xmlrpc:host'),
		port: nconf.get('rtorrent:xmlrpc:port'),
		path: nconf.get('rtorrent:xmlrpc:path'),
		headers: {
			'User-Agent': 'NodeJS XML-RPC Client',
			'Content-Type': 'text/xml',
			'Accept': 'text/xml',
			'Accept-Charset': 'UTF8',
			'Connection': 'Close'
		}
	});

	client.methodCall(api, array, function (err, data) {
		if (err) {
			return deferred.reject(err);
		}
		return deferred.resolve(data);
	});

	return deferred.promise;
}


var rtorrent = module.exports = {}

function methodCall (api, array) {

	if (nconf.get('rtorrent:option') === 'xmlrpc') {
		return xmlrpcMethodCall(api, array);
	}

	if (nconf.get('rtorrent:option') === 'scgi') {
		return scgiMethodCall(api, array);
	}
}

rtorrent.init = function () {
	createThrottleSettings()
		.then(function (results) {
			results.forEach(function (result) {
				if (result.state !== 'fulfilled') {
					logger.error(result.reason);
				}
			})
			logger.info('Finished creating throttle settings.');
		});
}

function createThrottleSettings () {
	logger.info('Creating throttle settings.');
	var upload_throttles = [];
	var download_throttles = [];
	var throttle_settings = [];
	var createThrottleSettingList = [];

	var throttleSpeed = 16;
	for (var i = 5 - 1; i >= 0; i--) {
		upload_throttles.push({
			display: 'Up_' + throttleSpeed,
			name: 'up_' + i,
			up: throttleSpeed,
			down: 0,
			direction: 'up'
		});
		throttleSpeed = throttleSpeed * 2
	}

	throttleSpeed = 16;
	for (var i = 5 - 1; i >= 0; i--) {
		download_throttles.push({
			display: 'Down_' + throttleSpeed,
			name: 'down_' + i,
			up: 0,
			down: throttleSpeed,
			direction: 'down'
		});
		throttleSpeed = throttleSpeed * 2
	}

	throttle_settings = upload_throttles.concat(download_throttles);

	for (var i = throttle_settings.length - 1; i >= 0; i--) {
		createThrottleSettingList.push(createThrottleSetting(throttle_settings[i]));
	}

	return Q.allSettled(createThrottleSettingList);
}

function createThrottleSetting (throttleSetting) {
	switch(throttleSetting.direction) {
		case 'up': 
			return rtorrent.throttleUp('' + throttleSetting.name, '' + throttleSetting.up);
		break;
		case 'down':
			return rtorrent.throttleDown('' + throttleSetting.name, '' + throttleSetting.up);
		break;
	}
}

rtorrent.throttleUp = function (name, value) {
	return methodCall('throttle_up', [name, value]);
}

rtorrent.throttleDown = function (name, value) {
	return methodCall('throttle_down', [name, value]);
}

rtorrent.setThrottle = function (hash, throttle_name) {
	return rtorrent.pauseTorrent(hash)
		.then(function () {
			return rtorrent.setThrottleName(hash, throttle_name);
		})
		.then(function () {
			return rtorrent.startTorrent(hash);
		});
}

rtorrent.setThrottleName = function (hash, throttle_name) {
	return methodCall('d.set_throttle_name', [hash, throttle_name]);
}

// get_complete, is_open, is_hash_checking, get_state
// need to figure out better way of getting the status
function getStatus (value) {
	if (value[0] === '1' && value[1] === '1' && value[2] === '0' && value[3] === '1') {
		return 'seeding';
	} else if (value[0] === '1' && value[1] === '0' && value[2] === '0' && value[3] === '0') {
		return 'finished';
	} else if (value[0] === '0' && value[1] === '1' && value[2] === '0' && value[3] === '1') {
		return 'downloading';
	} else if (value[0] === '0' && value[1] === '0' && value[2] === '0' && value[3] === '1') {
		// stopped in the middle
		return 'stopped';
	} else if (value[0] === '0' && value[1] === '0' && value[2] === '0' && value[3] === '0') {
		// i dont know stopped
		return 'stopped';
	} else if (value[0] === '0' && value[1] === '1' && value[2] === '0' && value[3] === '0') {
		return 'paused';
	} else if (value[0] === '1' && value[1] === '1' && value[2] === '0' && value[3] === '0') {
		// seeding pause
		return 'paused';
	} else if (value[0] === '1' && value[1] === '0' && value[2] === '0' && value[3] === '1') {
		return 'finished';
	} else if (value[2] === '1') {
		return 'checking';
	}
}

function adaptTorrentArray (torrent) {
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
		time_remaining: (torrent[2] - torrent[3]) / torrent[4] | 0,
		status: getStatus(torrent.slice(6, 10)),
		seeds: parseInt(torrent[10], 10),
		peers: parseInt(torrent[11], 10),
		total_peers: 0,
		total_seeds: 0
	}
}

rtorrent.getTorrents = function () {
	return methodCall('d.multicall', ['main', 'd.name=', 'd.hash=', 'd.size_bytes=', 'd.bytes_done=', 'd.get_down_rate=', 'd.get_up_rate=', 'd.get_complete=', 'd.is_open=', 'd.is_hash_checking=', 'd.get_state=', 'd.get_peers_complete=', 'd.get_peers_accounted=', 'd.get_up_total='])
		.then(function (data) {

			// If array is empty, return empty array
			if (data.length === 0) {
				return [];
			}

			// Adapt array from rtorrent properly for consumption by client
			var torrents = data.map(function (torrent) {
				return adaptTorrentArray(torrent);
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
			return methodCall('system.multicall', [systemMultiCallArray]).then(function(data) {
				var numberArray = [];
				
				// The length of data should be equal to the length of systemMultiCallArray
				data.forEach(function(item) {
					// Each item in the array has an array of arrays
					 item.forEach(function(itemagain) {
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
					torrent.total_peers = numberArray.shift();
					torrent.total_seeds = numberArray.shift();
					return torrent;
				});
			});
		});
}

rtorrent.loadTorrentFile = function (filepath) {
	return methodCall('load', [filepath, 'd.set_custom=x-filename']);
}

rtorrent.loadTorrentUrl = function (url) {
	return methodCall('load_start', [url]);
}

rtorrent.startTorrent = function (hash) {
	return methodCall('d.start', [hash])
		.then(function () {
			return methodCall('d.resume', [hash]);
		});
}

rtorrent.stopTorrent = function (hash) {
	return methodCall('d.close', [hash]);
}

rtorrent.pauseTorrent = function (hash) {
	return methodCall('d.stop', [hash]);
}

rtorrent.removeTorrent = function (hash) {
	return methodCall('d.erase', [hash]);
}

rtorrent.deleteTorrentData = function (hash) {
	return rtorrent.stopTorrent(hash).then(function() {
		return rtorrent.isMultiFile(hash).then(function(data) {
			return rtorrent.getDirectory(hash).then(function(dir) {
				if (data === '1') {
					return deleteData(dir).then(function() {
						return rtorrent.removeTorrent(hash);
					});
				} else {
					return rtorrent.getTorrentName(hash).then(function(name) {
						return deleteData(dir + '/' + name).then(function() {
							return rtorrent.removeTorrent(hash);
						});
					});
				}
				
			});
		});
	});
}

function deleteData (path) {
	var deferred = Q.defer();

	rimraf(path, function(err, results) {
		if (err) {
			deferred.reject(err)
		}

		deferred.resolve(results);
	});

	return deferred.promise;
}

rtorrent.getTorrentName = function (hash) {
	return methodCall('d.get_name', [hash]);
}

rtorrent.getBasePath = function (hash) {
	return methodCall('d.get_base_path', [hash]);
}

rtorrent.isMultiFile = function (hash) {
	return methodCall('d.is_multi_file', [hash]);
}

rtorrent.getDirectory = function (hash) {
	return methodCall('d.get_directory', [hash]);
}

rtorrent.getNetworkListenPort = function () {
	return methodCall('network.listen.port', []);
}

rtorrent.setPriority = function (priority) {
	return methodCall('d.set_priority', [hash, priority]);
}

// change to use nconf
rtorrent.getPortStatus = function (port) {
	var deferred = Q.defer();

	portscanner.checkPortStatus(port, 'localhost', function (err, data) {
		if (err) {
			return deferred.reject(err);
		}
		
		return deferred.resolve(data);
	});

	return deferred.promise;
}

rtorrent.getTotalPeers = function (hash) {
	return rtorrent.getScrapeIncomplete(hash)
		.then(function (data) {
			return data.map(function (value) {
				return parseInt(value, 10);
			})
			.reduce(function (a, b) {
				return a + b;
			}, 0);
		});
}

rtorrent.getTotalSeeds = function (hash) {
	return rtorrent.getScrapeComplete(hash)
		.then(function (data) {
			return data.map(function (value) {
				return parseInt(value, 10);
			}).reduce(function (a, b) {
				return a + b;
			}, 0);
		});
}

rtorrent.getScrapeIncomplete = function (hash) {
	return methodCall('t.multicall', [hash, 'd.get_hash=', 't.get_scrape_incomplete=']);
}

rtorrent.getScrapeComplete = function (hash) {
	return methodCall('t.multicall', [hash, 'd.get_hash=', 't.get_scrape_complete=']);
}

// get_port_range
// returns string of port range
rtorrent.getPortRange = function () {
	return methodCall('get_port_range', []);
}

rtorrent.setPortRange = function (value) {
	return methodCall('set_port_range', [value]);
}

// get_port_open
// returns 1 or 0
// Opens listening port
rtorrent.getPortOpen = function () {
	return methodCall('get_port_open', []);
}

rtorrent.setPortOpen = function (value) {
	return methodCall('set_port_open', [value]);
}

rtorrent.getUploadSlots = function () {
	return methodCall('get_max_uploads', []);
}

rtorrent.setUploadSlots = function (value) {
	return methodCall('set_max_uploads', [value]);
}

rtorrent.getUploadSlotsGlobal = function () {
	return methodCall('get_max_uploads_global', []);
}

rtorrent.setUploadSlotsGlobal = function (value) {
	return methodCall('set_max_uploads_global', []);
}

// get_port_random
// returns 1 or 0
// Randomize port each time rTorrent starts
rtorrent.getPortRandom = function () {
	return methodCall('get_port_random', []);
}

rtorrent.setPortRandom = function (value) {
	return methodCall('set_port_random', [value]);
}

// get_download_rate
// returns value in bytes
rtorrent.getGlobalMaximumDownloadRate = function () {
	return methodCall('get_download_rate', []);
}

// set_download_rate
// requires value in bytes
rtorrent.setGlobalMaximumDownloadRate = function (value) {
	return methodCall('set_download_rate', [value]);
}

// get_upload_rate
// returns value in bytes
rtorrent.getGlobalMaximumUploadRate = function () {
	return methodCall('get_upload_rate', []);
}

// set_upload_rate
// requires value in bytes
rtorrent.setGlobalMaximumUploadRate = function (value) {
	return methodCall('set_upload_rate', [value]);
}