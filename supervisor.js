var Agenda = require('agenda');
var dnode = require('dnode');

var DATABASE_URL = process.env['DATABASE_URL'];
var WORKER_URLS = process.env['WORKERS'].split(',');

// var agenda = new Agenda()
//   .database(DATABASE_URL, '/scheduler')
//   .processEvery('30 seconds');

var workers = WORKER_URLS.map(function(url) {
  
  try {

    var seg = url.split(':');
    return dnode.connect(seg[0], seg[1]);

  } catch(err) { console.log(err); }

});

workers.forEach(function(w) {

  w.on('remote', function(remote) {
    attachRPC(w, remote);
  });
  
});

function attachRPC(w, remote) {

  for(var key in remote) {

    if(remote.hasOwnProperty(key)) {
      w[key] = remote[key];
    }

  }

}

// agenda.start();
