var Github = {};
var ghClient = require('../services/github');

Github.eventMiddleware = function(req, res, next) {
  var ghEvent = req.headers['x-github-event'];
  if (ghEvent == 'issues') {
    if (req.body.action == 'opened') {
      req.ghEvent = 'event:new';
    }
  }
  next();
};

Github.repo = function(req, res, next) {
  var repository = req.params.repo;

  res.status(200).send({ repositories: ghClient.repos });
};

Github.payload = function(req, res) {
  console.log(req.ghEvent);
  var fullName = req.body.repository.full_name;

  if (req.ghEvent == 'event:new') {
    console.log('New event just came in!');
    var repo = ghClient.repos[fullName];
    var collaborator = repo.randomCollaborator().login;
    ghClient.notify(collaborator, fullName, req.body.issue.number, function(err, data) {
      if (err) { console.log(err); throw Error("We weren't able to notify "+ collaborator); }
      console.log('Great notification success!');
    });
  }

  res.status(200).send('Thanks!');
};

module.exports = Github;
