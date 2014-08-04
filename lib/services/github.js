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

Github.notify = function(options, cb) {
  console.log('preparing to notify '+ options.user);
  var title = 'Attention required! Repo: '+ options.repo +' Issue: '+ options.issue;
  var msg = 'Greetings fleshy contributor @'+ options.user +'!\n\n'+
            'It is your turn to triage this new issue in the repository _'+ options.repo +'_. '+
            'I believe it is a **'+ options.intelligence +'**, but I have not learned enough human yet to know for sure.\n\n'+
            'Please visit '+ config.contrib.dashboard_url +'?repo='+ options.repo +'&issue='+ options.issue +
            ' to process, or risk angering PAM.';
  var notificationRepo = new Repo(config.github.notifications.repo);
  notificationRepo.createIssue(title, msg, cb);
};

// Repository object
function Repo(repo) {
  var splitRepoName = repo.split('/');
  this.fullName = repo;
  this.user = splitRepoName[0];
  this.repoName = splitRepoName[1];
  this.collaborators = [];

  this.defaultOptions = {
    user: this.user,
    repo: this.repoName
  };

  this.findCollaborators();
}

Repo.prototype.findCollaborators = function() {
  var options = _.merge(this.defaultOptions, { per_page: 100 });

  var self = this;
  client.repos.getCollaborators(options, function(err, users) {
    if (err) { return new Error('Unable to retrieve collaborators'); }
    self.collaborators = _.union(self.collaborators, users);
  });
};

Repo.prototype.randomCollaborator = function() {
  return _.sample(this.collaborators, 1)[0];
};

Repo.prototype.createComment = function(issueId, msg, cb) {
  var options = _.merge(this.defaultOptions, { number: issueId, body: msg });
  client.issues.createComment(options, cb);
};

Repo.prototype.createIssue = function(title, msg, cb) {
  var options = _.merge(this.defaultOptions, { title: title, body: msg, labels: [] });
  client.issues.create(options, cb);
};

Repo.prototype.issues = function(state, label, page, per_page, cb) {
  var options = _.merge(this.defaultOptions, {
    state: state,
    labels: label,
    page: page,
    per_page: per_page || 100
  });
  client.issues.repoIssues(options, cb);
};

Github.Repo = Repo;
module.exports = Github;
