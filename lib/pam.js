// Deal with any command line options that were passed in
var commands = require('./cmd');

// Load up PAM's consciousness
var intelligence = require('./intelligence');

// Bring in the REST API
var app = require('./api');

// To speed things up like grabbing collaborators, init Github so we have things in memory.
var github = require('./services/github');
github.init();

// Start the server and go.
var port = process.env.PORT || 5000;
app.listen(port);
console.log('PAM listening on port '+ port);
