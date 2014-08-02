var github = require('octonode');
var config = require('../../config');
var _      = require('lodash');

var Github = {};
Github.repos = {};

var client = Github.client = github.client(config.github.token);

Github.init = function() {
  _.forEach(config.repositories, function(repo) {
    console.log('Setting up repository '+ repo);
    Github.addRepository(repo);
  });
};

Github.addRepository = function(repository) {
  var repo = Github.repos[repository] = new Repo(repository);
};

// Repository object
function Repo(repo) {
  this.repo = client.repo(repo);
  this.collaborators = [];

  this.findCollaborators();
}

Repo.prototype.findCollaborators = function() {
  var self = this;

  self.repo.collaborators(function(err, users) {
    if (err) { return new Error('Unable to retrieve collaborators'); }
    self.collaborators = _.union(self.collaborators, users);
  });
};

module.exports = Github;
