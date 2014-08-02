var Github = {};

Github.eventMiddleware = function(req, res, next) {
  req.githubEvent = req.headers['x-github-event'];
  next();
};

Github.payload = function(req, res) {
  console.log(req.githubEvent);

  if (req.githubEvent == 'issues') {

  }

  res.status(200);
};

module.exports = Github;
