var Agenda = require('agenda');
var dnonde = require('dnode');

var agenda = new Agenda()
  .database(process.env.DATABASE_URL, process.env.DATABASE_COLLECTION)
  .processEvery('10 seconds');


agenda.define('test done', function scheduler(job) {
  console.log('done!');
});

agenda.every('10 seconds', 'test done');

agenda.start();