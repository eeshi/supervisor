var WorkerCollection = (function() {
  
  function WorkerCollection(options) {
    this.active = [];
    this.inactive = [];
    this._setOptions(options);
    this._refreshConnections();
  }

  var collection = WorkerCollection.prototype;

  collection.init = function() {

    var self = this;

    this.active.forEach(function(worker) {
      worker.on('disconnect', function(err) {
        self._onTerminate(err, worker);
      });
    });

  };

  collection.addWorker = function(worker) {

    this.active.push(worker);

  };

  collection._setOptions = function(options) {

    this.options = {
      refresh: 5000// 5 minute default
    };

    if(options) {
      for(var op in options) {

        if(this.options.hasOwnProperty(op)) {
          if(op === 'refresh' && typeof options.op === 'number') {
            this.options[op] = options[op];
          } 
        }

      }
    }

  }; 

  collection._onTerminate = function(err, worker) {

    console.log(err);
    this._disconnectWorker(worker);

  };

  collection._disconnectWorker = function(worker) {

    var index = this.active.indexOf(worker);
    this.active.splice(index, 1);
    this.inactive.push(worker.url);

  };

  collection._reconnectWorker = function(worker) {
    
    var index = this.inactive.indexOf(worker.url);
    this.inactive.splice(index, 1);
    this.active.push(worker);

  };

  collection._refreshConnections = function() {
    
    var Worker = require('./Worker');
    var self = this;

    this._reconnectionQueue = setInterval(function() {

    if(self.inactive.length > 0) {
      self.inactive.forEach(function(url) {
        
        var worker = new Worker(url);
        self._reconnectWorker(worker);

      });
    }

    }, this.options.reconnectInterval);

  };

  return WorkerCollection;

})();

exports = module.exports = WorkerCollection;
