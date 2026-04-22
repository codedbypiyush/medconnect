const { Sequelize } = require('sequelize');
const config = require('./config')[process.env.NODE_ENV || 'development'];

module.exports = config.url
  ? new Sequelize(config.url, config)
  : new Sequelize(config);
