// var intelligence = require('./intelligence');

var app = require('./api');

var github = require('./services/github');
github.init();

// Deal with any command line options that were passed in
var commands = require('./cmd');

app.listen(3000);
console.log('PAM listening on port 3000');
