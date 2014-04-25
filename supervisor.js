var Agenda = require('agenda');
var utils = require('./utils');

var api = require('./lib/api');
var WorkerCollection = require('./lib/WorkerCollection');
var Worker = require('./lib/Worker');

var DATABASE_URL = process.env['DATABASE_URL'];
var WORKER_URLS = process.env['WORKERS'].split(',');

var agenda = new Agenda()
  .database(DATABASE_URL, '/scheduler')
  .processEvery('30 seconds');

var workerCollection = new WorkerCollection({ refresh: 30 * 1000 }); // 1 Minute

WORKER_URLS.forEach(function(url) {

  var worker = new Worker(url);
  workerCollection.addWorker(worker);

});

agenda.start();
