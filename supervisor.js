var Agenda = require('agenda');
var rpc = require('axon-rpc');
var axon = require('axon');

var req = axon.socket('req');

var api = require('./lib/api');

var DATABASE_URL = process.env['DATABASE_URL'];
var WORKER_URLS = process.env['WORKERS'].split(',');

// var agenda = new Agenda()
//   .database(DATABASE_URL, '/scheduler')
//   .processEvery('30 seconds');


var supervisor = new rpc.Client(req);

supervisor.call('wub', 'sent from the supervisor', function(err, message) {
  
  if(err) throw err;

  console.log(message);

});

req.connect(4000);
// agenda.start();
