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

workers.init();

// agenda.start();

function WorkerCollection() {

  this.active = [];
  this.unactive = [];

  WorkerCollection.prototype.init = function() {

    this.active.forEach(function(worker) {

      worker.conn.on('remote', worker.setRemote);

    });

  };

  WorkerCollection.prototype.addWorker = function(worker) {

    this.active.push(worker);

  };

  WorkerCollection.prototype.removeWorker = function(worker) {};

}

function Worker(conn) {

  this.conn = conn;

  Worker.prototype.setRemote = function(remote) {

    utils.mergeAttr(this, remote);
    
  };

}
