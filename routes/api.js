'use strict';

const expect = require('chai').expect;

const boardController = require('../controllers/boardController');

module.exports = function (app) {

  app.post('/api/threads/:board', boardController.postThread);

  app.post('/api/replies/:board', boardController.postReply);

  app.put('/api/threads/:board', boardController.reportThread);

  app.put('/api/replies/:board', boardController.reportReply);

  app.delete('/api/threads/:board', boardController.deleteThread);

  app.delete('/api/replies/:board', boardController.deleteReply);

  app.get('/api/threads/:board', boardController.getThreads);

  app.get('/api/replies/:board', boardController.getReplies);

  app.get('/b/:board/', function (req, res) {
      res.sendFile(process.cwd() + '/views/board.html');
  });

  app.get('/b/:board/:threadid', function (req, res) {
      res.sendFile(process.cwd() + '/views/thread.html');
  });

  app.get('/', function (req, res) {
      res.sendFile(process.cwd() + '/views/index.html');
  });
};
