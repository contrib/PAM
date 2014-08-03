var _ = require('lodash');
var Promise = require('bluebird');
var natural = require('natural');
var classifier = new natural.BayesClassifier();

var Parser = {};

var GH = function(repoName) {
  var github = require('../services/github');

  this.repo = new github.Repo(repoName);
};

GH.prototype.classifyIssues = function(state, label) {
  var repo = this.repo;
  return new Promise(function (resolve, reject) {
    repo.issues(state, label, 100, function(err, issues) {
      if (err) { return reject(err); }
      _.forEach(issues, function(issue) {
        Parser.add(issue.body, label);
      });
      resolve();
    });
  });
};

classifier.events.on('trainedWithDocument', function (obj) {
  console.log('Trained with a new document! '+ obj.index +'/'+ obj.total);
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
