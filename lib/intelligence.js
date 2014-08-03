var fs = require('fs');
var natural = require('natural');
var Intelligence = { enabled: false };
var rootDir = process.cwd();

fs.exists(rootDir +'/config/classifier.json', function(exists) {
  if (exists) {
    loadClassifiers();
  } else {
    console.log("Unable to load classifier config file. If you'd like to enable language parsing, you must train PAM first.");
    console.log("To train on a repo: $ node index.js --parse=user/reponame");
  }
});

function loadClassifiers() {
  natural.BayesClassifier.load(rootDir + '/config/classifier.json', null, function(err, classifier) {
    if (err){ throw Error(err); }
    Intelligence.enabled = true;
    Intelligence.classifier = classifier;
  });
}

module.exports = Intelligence;
