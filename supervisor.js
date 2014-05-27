var Agenda = require('agenda');
var rpc = require('axon-rpc');
var axon = require('axon');

var api = require('./lib/api');

var DATABASE_URL = process.env['DATABASE_URL'];
var WORKER_URLS = process.env['WORKERS'].split(',');

// var agenda = new Agenda()
//   .database(DATABASE_URL, '/scheduler')
//   .processEvery('30 seconds');

var workers = initWorkers(WORKER_URLS);

// agenda.start();

function initWorkers(urls) {
  
  var workers = urls.map(function(url) {
   
    var segments = url.split(':');
    var port = parseInt(segments.splice(segments.length - 1)[0]);
    var hostname = segments.join(':');

    var req = axon.socket('req');

    var worker = new rpc.Client(req);
    req.connect(port, hostname);

    return worker;

  });

  return workers;

}