/*jshint -W079 */
var net = require('net');
var Promise = require('bluebird');
var Serializer = require('./serializer');
var Deserializer = require('./deserializer');

function scgi(config) {
  this.config = config;

  return {
    call: call
  };

  function call(api, array) {
    return createConnection(config)
      .then(function (socket) {
        return createRequest(api, array)
          .then(function (request) {
            return sendRequest(socket)(request);
          })
          .then(function (socket) {
            return parseResponse(socket);
          });
      });
  }

  function createConnection(config) {
    var socket = new net.Socket();
    socket.connect(config.port, config.host);
    return new Promise(function (resolve, reject) {
      socket.on('connect', function () {
        return resolve(socket);
      });

      socket.on('error', function (err) {
        return reject(err);
      });
    });
  }

  function createRequest(api, array) {
    return new Promise(function (resolve) {
      var xml = Serializer.serializeMethodCall(api, array);
      var length = 0;
      var head = [
        'CONTENT_LENGTH' + String.fromCharCode(0) + xml.length + String.fromCharCode(0),
        'SCGI' + String.fromCharCode(0) + '1' + String.fromCharCode(0)
      ];

      head.forEach(function (item) {
        length += item.length;
      });

      var req = length + ':';

      head.forEach(function (item) {
        req += item;
      });

      req += ',';
      req += xml;

      return resolve(req);
    });
  }

  function sendRequest(socket) {
    return function (request) {
      return new Promise(function (resolve) {
        socket.write(request);
        socket.end();
        return resolve(socket);
      });
    };
  }

  function parseResponse(socket) {
    return new Promise(function (resolve, reject) {
      var deserializer = new Deserializer();

      deserializer.deserializeMethodResponse(socket, function (err, data) {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }
}

module.exports = scgi;
