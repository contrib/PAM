var express    = require('express');
var bodyParser = require('body-parser');

var app = express();

// Middlewares
app.use(bodyParser.json());

// Route requires
var Index = require('./routes/index');
var Github = require('./routes/github');

app.get('/', Index.get);

app.use(Github.eventMiddleware);
app.post('/github/payload', Github.payload);

// Error handling
function errorHandler(err, req, res, next) {
  res.status(500).send({ error: err.message });
}

app.use(errorHandler);

module.exports = app;
