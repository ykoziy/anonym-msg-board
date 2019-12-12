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

chai.use(chaiHttp);
before(function() {
  mongoose.connection.db.listCollections().toArray(function(err, collections) {
    if (err) console.log(err);
    for (item of collections) {
      console.log('Dropping collection: ' + item.name);
      mongoose.connection.dropCollection(item.name, (err, result) => {
        if (err) console.log(err);
      });
    }
  });
});

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {

    suite('POST', function() {
       test('Post new thread to the test board', function(done) {
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
              assert.equal(res.status, 200, 'status should be 200');
              assert.equal(thread.text, 'new thread', 'new thread does not exist');
              assert.exists(thread.delete_password, 'delete_password not assigned');
              done();
            });
          });
       });
    });

    suite('GET', function() {

    });

    suite('DELETE', function() {

    });

    suite('PUT', function() {

    });


  });

  suite('API ROUTING FOR /api/replies/:board', function() {

    suite('POST', function() {

    });

    suite('GET', function() {

    });

    suite('PUT', function() {

    });

    suite('DELETE', function() {

    });

  });

});
