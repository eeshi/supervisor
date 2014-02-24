// Set up dependencies
var Agenda = require('agenda');
var dnode = require('dnode');

// Agenda Config
var agenda = new Agenda()
  .database(process.env.DATABASE_URL, process.env.DATABASE_COLLECTION)
  .processEvery('10 seconds');

var workers = {};


// Set up RPC server
var server = dnode({
  initWorker: function(worker, callback) {
    
    console.log('Init worker' + worker);

    // Add a worker 
    workers[worker] = true;
    agenda.start();
    callback('SERVER listening');
  },
  getJobs: function(worker, callback) {

    agenda.define('find jobs', scheduler);

    function scheduler(job) {
      callback(worker);
    }

    agenda.every('20 seconds', 'find jobs');
  }
})

server.listen(process.env.PORT);
