'use strict';
const errorHandler = require('./ErrorHandler');

module.exports = function (app) {
  app.use(errorHandler.errorHandler);
};
