var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'experiments'
    },
    port: 3000,
  //  db: 'mongodb://localhost/citizen-engagement-node-skeleton'
  db: 'mongodb://localhost/citizen-engagement-node-skeleton'
  },

  test: {
    root: rootPath,
    app: {
      name: 'experiments'
    },
    port: 3000,
    db: 'mongodb://localhost/citizen-engagement-node-skeleton'
  },

  production: {
    root: rootPath,
    app: {
      name: 'experiments'
    },
    port: process.env.PORT,
    db: process.env.MONGODB_CON_STRING
  }
};

module.exports = config[env];
