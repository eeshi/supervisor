var collection = WorkerCollection.prototype;

exports = module.exports = WorkerCollection;

function WorkerCollection() {

  this.active = [];
  this.unactive = [];

  collection.init = function() {

    this.active.forEach(function(worker) {

      worker.conn.on('remote', worker.setRemote);
      worker.conn.on('fail', worker.terminate);
      worker.conn.on('end', worker.terminate);
      worker.conn.on('error', worker.onError);

    });

  };

  collection.addWorker = function(worker) {

    this.active.push(worker);

  };

  collection.removeWorker = function(worker) {};

}