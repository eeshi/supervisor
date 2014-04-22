var Agenda = require('agenda');
var dnode = require('dnode');
var utils = require('./utils');

var WorkerCollection = require('./lib/WorkerCollection');
var Worker = require('./lib/Worker');

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




