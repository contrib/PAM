var Github = {};
var gh = require('../services/github');

Github.eventMiddleware = function(req, res, next) {
  req.githubEvent = req.headers['x-github-event'];
  next();
};

Github.repo = function(req, res, next) {
  var repository = req.params.repo;

  console.log(gh.repos);
  res.status(200).send({ repo: repository });
};

Github.payload = function(req, res) {
  console.log(req.githubEvent);

  if (req.githubEvent == 'issues') {

  }

  res.status(200);
};

module.exports = Github;
