var Agenda = require('agenda');
var rpc = require('axon-rpc');
var axon = require('axon');

var api = require('./lib/api');
var models = require('./sources.json');

var DATABASE_URL = process.env['DATABASE_URL'];
var WORKER_URLS = process.env['WORKERS'].split(',');

var agenda = new Agenda()
  .database(DATABASE_URL, '/scheduler')
  .processEvery('5 minutes');

var workers = initWorkers(WORKER_URLS);

agenda.define('scrape links', function(job, done) {

  models.forEach(function(item, i, arr) {
    crawlLinks(item, i, arr)
  });

});

agenda.define('scrape post', function(job, done) {

});

agenda.every('30 2 * * *', 'scrape links'); // Repeat everyday at 2:30 am 

agenda.start();

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

function checkWorkerQueue(callback, i) {

  var i = i || 0; 

  workers[i].call('check status', function(err, status){

    if(err) {
      throw err;
    }

    if(status) { // true for avaiable, false for busy
     return callback(workers[i]);
    }
    
    return workers[++i] && checkWorkerQueue(workers, callback, i);

  });

}

function crawlLinks(item, i, arr) {

  var url = item.prot + item.baseUrl + item.linksList.startUrl;
  var model = item.linksList.model;
  var options = item.linksList.options;

  checkWorkerQueue(function(worker) {

    worker.call('scrape', url, model, options, function(err, data) {

      if(err) {
        throw err;
      }

      api.saveLinks(data, function(err, res) {

        if(err) {
          return console.log(err);
        }

        if (data.nextPageLink) {
          item.linksList.startUrl = data.nextPageLink;
          return crawlLinks(item, i, arr);
        } else {
          return;
        }

      });

    });

  });

}
