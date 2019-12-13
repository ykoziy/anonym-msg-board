'use strict';

function errorHandler(err, req, res, next) {
  if (err.name === 'ValidationError') {
    res.status(400).send({ error: err.message})
  } else {
    next(err)
  }
}

module.exports = {
  errorHandler
}
