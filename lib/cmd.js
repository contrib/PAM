var argv = require('minimist')(process.argv.slice(2));

if (argv.parse) {
  if (argv.parse === true) {
    return console.log('Repository is required for parsing. Doing nothing...');
  }

  console.log('Parsing issues.');

  var parser = require('./processes/parse-existing');
  var gh = parser.github(argv.parse);

  gh.classifyIssues('closed', 'question')
    .then(function() {
      return gh.classifyIssues('closed', 'enhancement');
    })
    .then(function() {
      return gh.classifyIssues('closed', 'bug');
    })
    .then(function() {
      return parser.train();
    })
    .then(function() {
      return parser.save();
    })
    .then(function(c) {
      console.log('Classifications saved! Total examples: '+ c.classifier.totalExamples);
      console.log(c.classifier.classTotals);
    })
    .catch(function(err) {
      console.error(err);
    });
}
