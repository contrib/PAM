var natural = require('natural');
var Intelligence = {};
var rootDir = process.cwd();

natural.BayesClassifier.load(rootDir + '/config/classifier.json', null, function(err, classifier) {
  if (err){
    console.log("Unable to load classifier config file. If you'd like to enable language parsing, you must train PAM first.");
    console.log("To train on a repo: $ node index.js --parse=user/reponame");
    Intelligence.enabled = false;
    return;
  }

  Intelligence.enabled = true;
  Intelligence.classifier = classifier;
});

module.exports = Intelligence;
