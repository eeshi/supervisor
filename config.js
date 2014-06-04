var config = {};
var env = process.env;

exports = config;
  
switch(env['NODE_ENV']) {

  case 'production':
    config = {
      WORKER_URLS: env['WORKERS'].split(',')
      DATABASE_URL: env['OPENSHIFT_MONGODB_DB_URL ']
    };
  break;

  default: 
    config = {
      DATABASE_URL: env['DATABASE_URL'] || 'mongodb://localhost:27017/eeshi',
      WORKER_URLS: env['WORKERS'].split(',') || 'localhost:3000'
    };
  break;

}
