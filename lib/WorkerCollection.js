var collection = WorkerCollection.prototype;

exports = module.exports = WorkerCollection;

function WorkerCollection(options) {

  this.active = [];
  this.unactive = [];
  this.options.reconnectInterval = options.reconnectInterval 
    ? options.reconnectInterval
    : 5 * 60 * 1000 // 5 minute default

  collection.init = function() {

    var self = this;

    this.active.forEach(function(worker) {

      worker.conn.on('remote', worker.setRemote);
      worker.conn.on('fail', function(err) {
        self._onTerminate(err, worker);
      });
      worker.conn.on('end',function(err) {
        self._onTerminate(err, worker);
      });
      worker.conn.on('error', function(err) {
        self._onTerminate(err, worker);
      });

    });

    this._tryReconnect();
  };

  collection.addWorker = function(worker) {

    this.active.push(worker);

  };

  collection.removeWorker = function(worker) {};

  collection._onTerminate = function(err, worker) {

    console.log(err);
    this._disconnectWorker(worker);

  };

  collection._tryReconnect = function() {

    var dnode = require('dnode');
    var Worker = require('./Worker');
    var self = this;

    this._reconnectionQueue = setInterval(function() {

      if(self.unactive.length > 0) {
        self.unactive.map(function(url) {
    
          try {

            var seg = url.split(':');
            console.log(url)
            var conn = dnode.connect(seg[0], seg[1]);
            var worker = new Worker(conn);

            return self._reconnectWorker(worker);

          } catch(err) { console.log(err); }

        });
      }

    }, this.options.reconnectInterval);

  };

  collection._disconnectWorker = function(worker) {

    var index = this.active.indexOf(worker);
    this.active.splice(index, 1);
    this.unactive.push(worker.url);

  };

  collection._reconnectWorker = function(worker) {
    
    var index = this.unactive.indexOf(worker);
    this.unactive.splice(index, 1);
    this.active.push(worker.url);

  };

}