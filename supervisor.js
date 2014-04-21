var Agenda = require('agenda');
var dnode = require('dnode');
var utils = require('./utils');

var DATABASE_URL = process.env['DATABASE_URL'];
var WORKER_URLS = process.env['WORKERS'].split(',');

// var agenda = new Agenda()
//   .database(DATABASE_URL, '/scheduler')
//   .processEvery('30 seconds');

var workers = new WorkerCollection();

WORKER_URLS.map(function(url) {
  
  try {

    var seg = url.split(':');
    var conn = dnode.connect(seg[0], seg[1]);
    var worker = new Worker(conn);

    return workers.addWorker(worker);

  } catch(err) { console.log(err); }

});

workers.forEach(function(w) {

  w.on('remote', function(remote) {
    attachRPC(w, remote);
  });

});

function WorkerCollection() {

  this.active = [];
  this.unactive = [];

  WorkerCollection.prototype.addWorker = function(worker) {

    this.active.push(worker);

  };

}

function Worker(conn) {



  Worker.prototype.setRemote = function(remote) {

    for(var key in remote) { 
      if(remote.hasOwnProperty(key)) {
        this[key] = remote[key];
      }
    }

  };

}
function attachRPC(w, remote) {

  for(var key in remote) {

    if(remote.hasOwnProperty(key)) {
      w[key] = remote[key];
    }

  }

}

// agenda.start();





