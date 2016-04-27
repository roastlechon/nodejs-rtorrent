/*jshint -W079 */
var expect = require('chai').expect;
var RTorrent = require('../lib/rtorrent');

describe('rtorrent.js', function () {
  describe('new rtorrent object', function () {
    it('should throw "Config not passed" error when creating new rtorrent object', function () {
      expect(function () {
        new RTorrent();
      }).to.throw(/Config not passed/);
    });

    it('should throw "Invalid config type" when creating new rtorrent object', function () {
      expect(function () {
        new RTorrent({});
      }).to.throw(/Invalid config type/);

      expect(function () {
        new RTorrent({
          type: 'xmllrpc'
        });
      }).to.throw(/Invalid config type/);

      expect(function () {
        new RTorrent({
          type: 'scgii'
        });
      }).to.throw(/Invalid config type/);
    });

    it('should throw "Invalid config options" when creating new rtorrent object', function () {
      expect(function () {
        new RTorrent({
          type: 'xmlrpc'
        });
      }).to.throw(/Invalid config options/);

      expect(function () {
        new RTorrent({
          type: 'scgi'
        });
      }).to.throw(/Invalid config options/);

      expect(function () {
        new RTorrent({
          type: 'scgi',
          host: ''
        });
      }).to.throw(/Invalid config options/);
    });

    it('should not throw error when creating new rtorrent object', function () {
      expect(function () {
        new RTorrent({
          type: 'xmlrpc',
          host: '127.0.0.1',
          port: '80',
          path: '/rpc2'
        });
      }).to.not.throw(Error);
    });
  });

  describe('rtorrent methodcall', function () {

    it('should return back array of data given api and array of parameters', function (done) {
      this.timeout(1000);

      var rtorrent = new RTorrent({
        type: 'scgi',
        host: 'localhost',
        port: '5000'
      });

      rtorrent.methodCall('d.multicall', ['main', 'd.name='])
        .then(function (data) {
          expect(data instanceof Array).to.be.true;
          done();
        });
    });
  });
});
