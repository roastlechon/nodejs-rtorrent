var Torrent = function (data) {
  this.name = '';
  this.hash = '';
  this.size = 0;
  this.downloaded = 0;
  this.uploaded = 0;
  this.dlSpeed = 0;
  this.ulSpeed = 0;
  this.percentComplete = 0;
  this.eta = 0;
  this.status = 0;
  this.seeds = 0;
  this.peers = 0;
  this.totalSeeds = 0;
  this.totalPeers = 0;

  setResponse.apply(this, [data]);

  function setResponse(data) {
    this.name = data[0];
    this.hash = data[1];
    this.size = parseInt(data[2], 10);
    this.downloaded = parseInt(data[3], 10);
    this.uploaded = parseInt(data[12], 10);
    this.dlSpeed = parseInt(data[4], 10);
    this.ulSpeed = parseInt(data[5], 10);
    this.percentComplete = Math.round((data[3] / data[2]) * 100) / 100;
    this.eta = (function () {
      var num = (data[2] - data[3]) / data[4];
      if (isNaN(num) || num === Infinity) {
        return 0;
      }
      return num;
    })();
    this.status = getStatus(data.slice(6, 10));
    this.seeds = parseInt(data[10], 10);
    this.peers = parseInt(data[10], 10);
    this.totalSeeds = 0;
    this.totalPeers = 0;
  }

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
};

module.exports = Torrent;
