var collection = WorkerCollection.prototype;

exports = module.exports = WorkerCollection;

function WorkerCollection() {

  this.active = [];
  this.unactive = [];

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

  };

  collection.addWorker = function(worker) {

    this.active.push(worker);

  };

  collection.removeWorker = function(worker) {};

  collection._onTerminate = function(err, worker) {

    console.log(err);

    var index = this.active.indexOf(worker);
    this.active.splice(index, 1);
    this.unactive.push(worker.url);

  };

}