var Agenda = require('agenda');
var dnonde = require('dnonde');

var agenda = new Agenda()
  .database(process.env.DATABASE_URL, process.env.DATABASE_COLLECTION)
  .processEvery('1 minute');


agenda.