// var github = require('octonode');
var GitHubApi = require('github');
var config = require('../../config');
var _      = require('lodash');

var Github = {};
Github.repos = {};

var client = Github.client = new GitHubApi({ version: "3.0.0" });

// var client = Github.client = github.client(config.github.token);
client.authenticate({
    type: "oauth",
    token: config.github.token
});

Github.init = function() {
  _.forEach(config.github.repositories, function(repo) {
    console.log('Setting up repository '+ repo);
    Github.addRepository(repo);
  });
};

Github.addRepository = function(repository) {
  var repo = Github.repos[repository] = new Repo(repository);
};

Github.notify = function(user, repo, issue, cb) {
  console.log('preparing to notify '+ user);
  var title = 'Attention required! Repo: '+ repo +' Issue: '+ issue;
  var msg = 'Greetings fleshy contributor @'+ user +'!\n\n'+
            'It is your turn to triage this new issue: '+ repo +'#'+ issue + '.\n\n'+
            'Please go '+ config.contrib.dashboard_url +'?repo='+ repo +'&issue='+ issue +
            ' to process, or risk angering PAM.';
  var notificationRepo = new Repo(config.github.notifications.repo);
  notificationRepo.createIssue(title, msg, cb);
};

// Repository object
function Repo(repo) {
  var splitRepoName = repo.split('/');
  this.full_name = repo;
  this.user = splitRepoName[0];
  this.repo_name = splitRepoName[1];
  this.collaborators = [];

  this.findCollaborators();
}

Repo.prototype.findCollaborators = function() {
  var self = this;

  client.repos.getCollaborators({ user: self.user, repo: self.repo_name, per_page: 100 }, function(err, users) {
    if (err) { return new Error('Unable to retrieve collaborators'); }
    self.collaborators = _.union(self.collaborators, users);
  });
};

Repo.prototype.randomCollaborator = function() {
  return _.sample(this.collaborators, 1)[0];
};

Repo.prototype.createComment = function(issueId, msg, cb) {
  client.issues.createComment({ user: this.user, repo: this.repo_name, number: issueId, body: msg }, cb);
};

Repo.prototype.createIssue = function(title, msg, cb) {
  client.issues.create({ user: this.user, repo: this.repo_name, title: title, body: msg, labels: [] }, cb);
};

module.exports = Github;
