/*jshint -W079 */
// var core = require('./core');
var xmlrpc = require('xmlrpc');
var Promise = require('bluebird');
var net = require('net');
var Serializer = require('./serializer');
var Deserializer = require('./deserializer');
// var sax = require('sax');

var RTorrent = function (config) {
  this.methodCall = undefined;
  this.client = undefined;
  this.config = config;

  if (!config) {
    throw Error('Config not passed');
  }

  if (!config.type || !(config.type === 'xmlrpc' || config.type === 'scgi')) {
    throw Error('Invalid config type');
  }

  if (!config.host || !config.port) {
    throw Error('Invalid config options');
  }

  if (config.type === 'xmlrpc' && !config.path) {
    throw Error('Invalid config options');
  }

  if (config.type === 'xmlrpc') {
    this.methodCall = function (api, array) {
      var that = this;

      if (!that.client) {
        that.client = xmlrpc.createClient({
            host: config.host,
            port: config.port,
            path: config.path,
            headers: {
              'User-Agent': 'NodeJS XML-RPC Client',
              'Content-Type': 'text/xml',
              'Accept': 'text/xml',
              'Accept-Charset': 'UTF8',
              'Connection': 'Close'
            }
        });
      }

      var methodCall = Promise.promisify(that.client.methodCall);
      return methodCall(api, array);
    };
  }

  if (config.type === 'scgi') {
    this.methodCall = function (api, array) {
      var that = this;

      if (!that.client) {
        that.client = net.connect(config.port, config.host);
      }

      return new Promise(function (resolve, reject) {
        that.client.on('connect', function () {
          console.log('connected');
          var xml = Serializer.serializeMethodCall(api, array);
          var length = 0;
          var head = [
            'CONTENT_LENGTH' + String.fromCharCode(0) + xml.length + String.fromCharCode(0),
            'SCGI' + String.fromCharCode(0) + '1' + String.fromCharCode(0)
          ];

          head.forEach(function (item) {
            length += item.length;
          });

          that.client.write(length + ':');

          head.forEach(function (item) {
            that.client.write(item);
          });

          that.client.write(',');
          that.client.write(xml);

          var deserializer = new Deserializer('UTF-8');

          deserializer.deserializeMethodResponse(that.client, function (err, data) {
            if (err) {
              return reject(err);
            }
            return resolve(data);
          });


        });

       });


    };
  }
};

module.exports = RTorrent;
