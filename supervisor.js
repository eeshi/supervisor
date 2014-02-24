// Set up dependencies
var Agenda = require('agenda');
var dnode = require('dnode');
var format = require('util').format;

// Set uo environment variables
var PROTOCOL = process.env.PROTOCOL;
var baseUrl = process.env.BASE_URL; 
var section = process.env.SECTION;
var jobSelector = process.env.JOB_SELECTOR;
var nextPageSelector = process.env.NEXT_PAGE;

// Agenda Config
var agenda = new Agenda()
  .database(process.env.DATABASE_URL, process.env.DATABASE_COLLECTION)
  .processEvery('5 seconds');


var workers = {};
var site = {
  url: format('%s://%s', PROTOCOL, baseUrl),
  section: section,
  selectors: {
    job: jobSelector,
    nextPage: nextPageSelector
  }
};

// Set up RPC server
var server = dnode({
  initWorker: function(worker, callback) {
    
    console.log('Init worker' + worker.id);

    // Add a worker 
    workers[worker.id] = true;

    agenda.start();
    callback('SERVER listening');
  },
  getJobs: function(worker, callback) {

    agenda.define('find jobs', getJobs);

    function getJobs(job) {
      callback(site);
    }

    agenda.every('5 seconds', 'find jobs');
  }
})

server.listen(process.env.PORT);
