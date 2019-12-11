const Thread = require('../models/Thread');
const Reply = require('../models/Reply');
const Board = require('../models/Board');

function postThread(req, res, next) {
  const board = req.params.board;
  const {text, delete_password} = req.body;
  const newThread = new Thread({text, delete_password, replies: []});
  newThread.save()
    .then(thread => {
      return Board.findOneAndUpdate({board_title: board}, {$push: {threads: thread}}, {upsert: true, new: true}).exec();
    })
    .then(data => {
      res.redirect('/b/' + board);
    })
    .catch(err => {
      return next(err);
    });
}

function postReply(req, res, next) {
  const board = req.params.board;
  const {text, delete_password, thread_id} = req.body;

  const newReply = new Reply({text, delete_password});
  newReply.save((err, data) => {
    if (err) return next(err);
    Thread.findByIdAndUpdate(thread_id, {bumped_on: Date.now(), $push: {replies: data}}, (err) => {
      if (err) return next(err);
      res.redirect('/b/' + board + '/' + thread_id);
    });
  });
}

function reportThread(req, res, next) {
  const thread_id = req.body.thread_id;
  Thread.findByIdAndUpdate(thread_id, {reported: true}, (err) => {
    if (err) return next(err);
    res.send('success');
  });
}

function reportReply(req, res, next) {
  const reply_id = req.body.reply_id;
  Reply.findByIdAndUpdate(reply_id, {reported: true}, (err) => {
    if (err) return next(err);
    res.send('success');
  });
}

function deleteThread(req, res) {
  //remove thread with replies completely
  res.send(`NOT IMPLEMENTED: Delete thread in board: ${req.params.board} with thread_id: ${req.body.thread_id} and delete_password: ${req.body.delete_password}`);
}

function deleteReply(req, res) {
  const {delete_password, reply_id} = req.body;
  Reply.findById(reply_id, (err, reply) => {
    reply.comparePassword(delete_password, (err, isMatch) => {
      if (err) return next(err);
      if (isMatch) {
        reply.text = '[deleted]';
        reply.save((err, data) => {
          if (err) return next(err);
          return res.send('success');
        });
      } else {
        return res.send('incorrect password');
      }
    });
  });
}

function getReplies(req, res) {
  const thread_id = req.query.thread_id;
  const select_fields = '-delete_password -reported -__v';
  Thread.findById(thread_id, select_fields)
        .populate({path: 'replies', select: select_fields, options: { sort: {created_on: 'desc'}} })
        .exec((err, replies) => {
          if (err) return next(err);
          return res.send(replies);
        });
}

// getThreads from board req.params.board
function getThreads(req, res) {
  // Get an array of 10 most recent bumped threads,
  // on the board with only the three most recent replies from /api/threads/{board}.
  // The reported and delete_passwords fields will not be sent.
  console.log('getting threads: ' + req.params.board);
  res.send(`NOT IMPLEMENTED: Get threads for board: ${req.params.board}`);
}



module.exports = {
  postThread,
  postReply,
  getReplies,
  reportThread,
  reportReply,
  deleteThread,
  deleteReply,
  getThreads
}
