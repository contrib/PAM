var _ = require('lodash');
var Promise = require('bluebird');
var natural = require('natural');
var classifier = new natural.BayesClassifier();

var Parser = {};

var GH = function(repoName) {
  var github = require('../services/github');

  this.repo = Promise.promisifyAll(new github.Repo(repoName));
};

GH.prototype.classifyIssues = function(state, label) {
  var repo = this.repo;

  // For now, we'll just get the first page.
  return this.repo.issuesAsync(state, label, 1, 100).bind(this)
    .then(function(issues) {
      _.forEach(issues, function(issue) {
        Parser.add(issue.body, label);
      });
      return issues;
    });
};

classifier.events.on('trainedWithDocument', function (obj) {
  console.log('PAM learned something new ('+ obj.index +'/'+ obj.total +')');
});

Parser.add = function (text, category) {
  return classifier.addDocument(text, category);
};

Parser.train = function() {
  return classifier.train();
};

Parser.save = function() {
  return new Promise(function(resolve, reject) {
    var rootDir = process.cwd();
    classifier.save(rootDir +'/config/classifier.json', function(err, classifier) {
      if (err) { return reject(err); }
      console.log('Classifier saved!');
      resolve(classifier);
    });
  });
};

Parser.github = function(repoName) {
  return new GH(repoName);
};

module.exports = Parser;
