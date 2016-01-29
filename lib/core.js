var xmlrpc = require('xmlrpc');
var Q = require('q');
var Deserializer = require('./deserializer');
var Serializer = require('./serializer');
var net = require('net');
var logger = require('winston');
var nconf = require('nconf');

if (!(nconf.get('rtorrent:option') === 'scgi' || nconf.get('rtorrent:option') === 'xmlrpc')) {
  var err = new Error('Config for rtorrent option is not valid. Please check config.json rtorrent.option property.');
  logger.error(err.message);
  throw err;
}

logger.info('Connect to rtorrent via', nconf.get('rtorrent:option'));

function scgiMethodCall(api, array) {
  var stream = net.connect(5000, 'localhost');
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
      deferred.reject(err);
    }

    deferred.resolve(data);
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
      deferred.reject(err);
    }

    deferred.resolve(data);
  });

  return deferred.promise;
}

function methodCall (api, array) {
  if (nconf.get('rtorrent:option') === 'xmlrpc') {
    return xmlrpcMethodCall(api, array);
  }

  if (nconf.get('rtorrent:option') === 'scgi') {
    return scgiMethodCall(api, array);
  }
}

module.exports = {
  methodCall: methodCall
};
