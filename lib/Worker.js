var dnode = require('dnode');
var eeshiUtils = require('../utils');

var Worker = (function() {

  function Worker(url) {
    this.url = url;    
    this.active = false;    
    this._initConnection();
    this._setUpEvents();
  }

  var work = Worker.prototype;
  
  work._initConnection = function() {

    try {
      var seg = this.url.split(':');
      this.conn = dnode.connect(seg[0], seg[1]);
    } catch(err) { console.log(err) }

  }

  work._setUpEvents = function() {
    var self = this;
    this.conn.on('remote', function(remote) {
      self._setRemote(self, remote);
    });
    this.conn.on('fail', function(err) {
      self._onError(err, self);
    });
    this.conn.on('end', function(err) {
      self._onError(err, self);
    });
    this.conn.on('error', function(err) {
      self._onError(err, self);
    });

  };

  work._setRemote = function(self, remote) {

    eeshiUtils.mergeAttr(self, remote);
    self.active = true;

  };

  work._onError = function(err, self) {

    console.log('Failed connecting Worker:', this.url);
    self.active = false;

  };

  return Worker;

})();

exports = module.exports = Worker;
