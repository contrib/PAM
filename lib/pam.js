var app = require('./api');

var github = require('./services/github');
github.init();

app.listen(3000);
console.log('PAM listening on port 3000');
