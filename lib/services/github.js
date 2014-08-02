var github = require('octonode');
var config = require('../../config').github;

var client = github.client(config.token);

// client.get('/user', {}, function (err, status, body, headers) {
//   console.log(body);
// });

module.exports = client;
