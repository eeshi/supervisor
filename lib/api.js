var request = require('request');

var API = (function() {

  function API() {
    this.API_BASE_URL = process.env['API_BASE_URL'];
  }

  var consume = API.prototype;

  consume.getJobLinks = function() {

    request.get(this.API_BASE_URL + '/joblinks', function(err, res, body) {

    if(err) {
      console.log(err)
    }

    console.log(body)

    });

  };
  
  consume.saveLinks = function(links, callback) {

    request.post(this.API_BASE_URL + '/joblinks', links, callback);

  };

  consume.saveJobPost = function(post, callback) {

    request.post(this.API_BASE_URL + '/jobposts', post, callback);

  };

  return API;

})();

exports = module.exports = new API();

