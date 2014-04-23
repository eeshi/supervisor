var dnode = require('dnode');
var utils = require('../utils');

var work = Worker.prototype;

exports = module.exports = Worker;

var Worker = (function()

  function Worker(url) {
    this._initConnection(url);
  }

  work.setRemote = function(remote) {

    utils.mergeAttr(this, remote);

    remote.greet('Supervisor says hello!', function(res) {
      console.log(res);
    });

  };

  work._initConnection = function() {

    try {
      var seg = url.split(':');
      this.conn = dnode.connect(seg[0], seg[1]);
    } catch(err) { console.log(err) }

  }

  return Worker;
  
)();

