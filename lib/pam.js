var app = require('./api');

var github = require('./services/github');
github.init();

var intelligence = require('./intelligence');

// Deal with any command line options that were passed in
var commands = require('./cmd');

app.listen(3000);
console.log('PAM listening on port 3000');
