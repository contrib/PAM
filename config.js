var env = process.env.NODE_ENV || 'development';

if (env == 'development') {
  var dotenv = require('dotenv');
  dotenv.load();
}

var config = {
  github: {
    token: process.env.GITHUB_AUTHORIZATION_TOKEN
  }
};

module.exports = config;
