var Agenda = require('agenda');
var rpc = require('axon-rpc');
var axon = require('axon');

var api = require('./lib/api');

var DATABASE_URL = process.env['DATABASE_URL'];
var WORKER_URLS = process.env['WORKERS'].split(',');

var agenda = new Agenda()
  .database(DATABASE_URL, '/scheduler')
  .processEvery('5 minutes');

var workers = initWorkers(WORKER_URLS);

agenda.define('scrape links', function(job, done) {

  checkAndCall(workers, function(worker) {

    worker.call('scrape links', { model: 'goes here' }, function(err, links) {

      if(err) {
        throw err;
      }

      api.saveLinks(links);


    });

  });

});

agenda.define('scrape post', function(job, done) {

});

agenda.every('30 2 * * *', 'scrape links'); // Repeat everyday at 2:30 am 

agenda.start();

checkAndCall(workers, function(worker) {

  worker.call('scrape links', 'wub wub', function(err, links) {

    console.log(links)
    
  });

});

function initWorkers(urls) {
  
  var workers = urls.map(function(url) {
   
    var segments = url.split(':');
    var port = parseInt(segments.splice(segments.length - 1)[0], 10);
    var hostname = segments.join(':');

    var req = axon.socket('req');

    var worker = new rpc.Client(req);
    req.connect(port, hostname);

    return worker;

  });

  return workers;

}

function checkAndCall(workers, callback, i) {

  var i = i || 0; 

  workers[i].call('check status', null, function(err, status){

    if(err) {
      throw err;
    }

    if(status) { // true for avaiable, false for busy
     return callback(workers[i]);
    }
    
    return workers[++i] && checkAndCall(workers, callback, i);

  });

}

