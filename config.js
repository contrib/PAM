var env = process.env.NODE_ENV || 'development';

if (env == 'development') {
  var dotenv = require('dotenv');
  dotenv.load();
}

var config = {
  github: {
    token: process.env.GITHUB_AUTHORIZATION_TOKEN,
    notifications: {
      repo: 'pam/notifications-testing'
    },
    repositories: [
      'contrib/PAM-test'
    ]
  },
  contrib: {
    dashboard_url: 'http://issues.contrib.io/first-response'
  }
};

module.exports = config;
