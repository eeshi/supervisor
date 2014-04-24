var dnode = require('dnode');
var util = require("util");
var events = require("events");
var eeshiUtils = require('../utils');

var Worker = (function() {

  function Worker(url) {
    events.EventEmitter.call(this); 
    this._initConnection(url);
    this._setUpEvents();
  }

  util.inherits(Worker, events.EventEmitter);
  var work = Worker.prototype;
  
  work._initConnection = function(url) {

    try {
      var seg = url.split(':');
      this.conn = dnode.connect(seg[0], seg[1]);
    } catch(err) { console.log(err) }

  }

  work._setUpEvents = function() {

    this.conn.on('remote', this._setRemote);
    this.conn.on('fail', this._emitFail);
    this.conn.on('end', this._emitFail);
    this.conn.on('error', this._emitFail);

  };

  work._setRemote = function(remote) {

    eeshiUtils.mergeAttr(this, remote);

    remote.greet('Supervisor says hello!', function(res) {
      console.log(res);
    });

  };

  work._emitFail = function(err) {
    
    this.emit('disconnect', err);

  };

  return Worker;

})();

exports = module.exports = Worker;
