var Agenda = require('agenda');
var dnode = require('dnode');

var DATABASE_URL = process.env['DATABASE_URL'];

var agenda = new Agenda()
  .database(DATABASE_URL, '/scheduler')
  .processEvery('30 seconds');

var d = dnode.connect(PORT);



