/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

const mongoose = require("mongoose");
const Thread = mongoose.model('Thread');
const Reply = mongoose.model('Reply');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  let threadId = '';
  suiteSetup(function() {
    console.log('Dropping collections...');
    mongoose.connection.db.listCollections().toArray(function(err, collections) {
      if (err) console.log(err);
      for (item of collections) {
        mongoose.connection.dropCollection(item.name, (err, result) => {
          if (err) console.log(err);
        });
      }
    });
  });

  suite('API ROUTING FOR /api/threads/:board', function() {

    suite('POST', function() {
       test('Post "new thread" to the test board', function(done) {
        chai.request(server)
          .post('/api/threads/test')
          .send({
            text: 'new thread',
            delete_password: '123'
          })
          .end(function(err, res) {
            Thread.findOne({text: 'new thread'}, (err, thread) => {
              if (err) {
                assert.fail(err);
                return done();
              }
              threadId = thread._id.toString();
              assert.equal(res.status, 200, 'status should be 200');
              assert.equal(thread.text, 'new thread', 'new thread does not exist');
              assert.exists(thread.delete_password, 'delete_password not assigned');
              done();
            });
          });
       });
    });

    suite('GET', function() {
      test('List recent threads in the test board', function(done) {
        chai.request(server)
          .get('/api/threads/test')
          .end(function(err, res) {
            let resBody = res.body[0];
            assert.equal(res.status, 200, 'status should be 200');
            assert.equal(resBody.text, 'new thread', 'new thread does not exist');
            assert.equal(resBody.replycount, 0, 'replycount field is not zero');
            assert.isArray(resBody.replies, 'replies field is not an array');
            assert.notExists(resBody.reported, 'reported field exists');
            assert.notExists(resBody.delete_password, 'delete_password field exists');
            done();
          });
      });
    });

    suite('PUT', function() {
      test('Report "new thread" in the test board', function(done) {
        chai.request(server)
          .put('/api/threads/test')
          .send({thread_id: threadId})
          .end(function(err, res) {
            Thread.findOne({text: 'new thread'}, (err, thread) => {
              if (err) {
                assert.fail(err);
                return done();
              }
              assert.equal(res.status, 200, 'status should be 200');
              assert.equal(thread.reported, true, 'reported field is not true');
              done();
            });
         });
      });
    });

    suite('DELETE', function() {
      test('Delete "new thread" in the test board', function(done) {
        chai.request(server)
          .delete('/api/threads/test')
          .send({
            thread_id: threadId,
            delete_password: '123'
          })
          .end(function(err, res) {
            Thread.findById(threadId, (err, thread) => {
              if (err) {
                assert.fail(err);
                return done();
              }
              assert.equal(res.status, 200, 'status should be 200');
              assert.equal(res.text, 'success', 'deleting thread failed');
              assert.isNull(thread, 'new thread is not null');
              done();
            });
         });
      });
    });

  });

  suite('API ROUTING FOR /api/replies/:board', function() {
    let threadId = '';
    let replyId = '';
    suiteSetup(function() {
      console.log('Setting up thread2....');
      return chai.request(server)
        .post('/api/threads/test')
        .send({
          text: 'thread2',
          delete_password: '123'
        })
        .then(function(err, res) {
          return Thread.findOne({text: 'thread2'}, (err, thread) => {
            if (err) {
              assert.fail(err);
            }
            threadId = thread._id.toString();
          });
        });
    })

    suite('POST', function() {
      test('Post "new reply" in thread2', function(done) {
        chai.request(server)
          .post('/api/replies/test')
          .send({
            text: 'new reply',
            delete_password: '123',
            thread_id: threadId
          })
          .end(function(err, res) {
            Reply.findOne({text: 'new reply'}, (err, reply) => {
              if (err) {
                assert.fail(err);
                return done();
              }
              replyId = reply._id.toString();
              assert.equal(res.status, 200, 'status should be 200');
              assert.equal(reply.text, 'new reply', 'new reply does not exist');
              assert.exists(reply.delete_password, 'delete_password not assigned');
              done();
            });
          });
      });
    });

    suite('GET', function() {
      test('Get all replies for thread2', function(done) {
        chai.request(server)
          .get('/api/replies/test')
          .query({thread_id: threadId})
          .end(function(err, res) {
            assert.equal(res.status, 200, 'status should be 200');
            assert.equal(res.body.text, 'thread2', 'thread2 does not exist');
            assert.equal(res.body.replycount, 1, 'replycount field is not one');
            assert.equal(res.body.replies.length, 1, 'replies array length is not one');
            assert.isArray(res.body.replies, 'replies field is not an array');

            let reply = res.body.replies[0];
            assert.equal(reply.text, 'new reply', 'new reply does not exist');
            assert.notExists(reply.reported, 'reported field exists');
            assert.notExists(reply.delete_password, 'delete_password field exists');
            done();
          });
      });
    });

    suite('PUT', function() {
      test('Report "new reply" in thread2', function(done) {
        chai.request(server)
          .put('/api/replies/test')
          .send({reply_id: replyId})
          .end(function(err, res) {
            Reply.findOne({text: 'new reply'}, (err, reply) => {
              if (err) {
                assert.fail(err);
                return done();
              }
              assert.equal(res.status, 200, 'status should be 200');
              assert.equal(reply.reported, true, 'reported field is not true');
              done();
            });
         });
      });
    });

    suite('DELETE', function() {
      test('Delete "new reply" in thread2', function(done) {
        chai.request(server)
          .delete('/api/replies/test')
          .send({
            reply_id: replyId,
            delete_password: '123'
          })
          .end(function(err, res) {
            Reply.findById(replyId, (err, reply) => {
              if (err) {
                assert.fail(err);
                return done();
              }
              assert.equal(res.status, 200, 'status should be 200');
              assert.equal(res.text, 'success', 'deleting thread failed');
              assert.equal(reply.text, '[deleted]', 'text is not equal to [deleted]');
              done();
            });
          })
      });
    });

  });

});
