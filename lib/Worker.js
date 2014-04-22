var utils = require('../utils');

var worker = Worker.prototype;

exports = module.exports = Worker;

function Worker(conn) {

  this.conn = conn;

  worker.setRemote = function(remote) {

    utils.mergeAttr(this, remote);

    remote.greet('Supervisor says hello!', function(res) {
      console.log(res);
    });

  };

  worker.terminate = function() {

    console.log('Connection ended');

  };

  worker.onError = function(err) {

    console.log(err);

  };

}