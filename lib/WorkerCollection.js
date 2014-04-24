var WorkerCollection = (function() {
  
  function WorkerCollection(options) {
    this._workers = [];
    this._setOptions(options);
    this._refreshConnections();
  }

  var collection = WorkerCollection.prototype;

  collection.addWorker = function(worker) {

    this._workers.push(worker);

  };

  collection._setOptions = function(options) {

    this.options = {
      refresh: 60 * 1000// 1 minute default
    };

    if(options) {
      for(var op in options) {

        if(this.options.hasOwnProperty(op)) {
          if(op === 'refresh' && typeof options[op] === 'number') {
            this.options[op] = options[op];
          } 
        }

      }
    }

  }; 

  collection._refreshConnections = function() {
    
    var Worker = require('./Worker');
    var self = this;

    this._reconnectionQueue = setInterval(function() {

      self._workers.map(function(worker) {
        console.log(worker.active)
        if(!worker.active) {
          return new Worker(worker.url);
        }

      });

    }, this.options.refresh);

  };

  return WorkerCollection;

})();

exports = module.exports = WorkerCollection;

