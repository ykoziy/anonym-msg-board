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
    Thread.findByIdAndUpdate(thread_id,
      {
        bumped_on: Date.now(),
        $push: {replies: data},
        $inc: {replycount: 1}
      },
      {
        new: true
      }, (err, thread) => {
        if (err) return next(err);
        if(!thread) {
          return res.send('thread id not found');
        }
        res.redirect('/b/' + board + '/' + thread_id);
    });
  });
}

function reportThread(req, res, next) {
  const thread_id = req.body.thread_id;
  Thread.findByIdAndUpdate(thread_id, {reported: true}, {new: true}, (err, thread) => {
    if (err) return next(err);
    if(!thread) {
      return res.send('thread id not found');
    }
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

function deleteThread(req, res, next) {
  const {delete_password, thread_id} = req.body;
  Thread.findById(thread_id, (err, thread) => {
    thread.comparePassword(delete_password, (err, isMatch) => {
      if (err) return next(err);
      if (isMatch) {
        thread.remove((err, data) => {
          if (err) return next(err);
          return res.send('success');
        });
      }  else {
        return res.send('incorrect password');
      }
    });
  });
  //remove thread with replies completely
  // remove related entry in Board
}

function deleteReply(req, res, next) {
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

function getReplies(req, res, next) {
  const thread_id = req.query.thread_id;
  const select_fields = '-delete_password -reported -__v';
  Thread.findById(thread_id, select_fields)
        .populate({path: 'replies', select: select_fields, options: { sort: {created_on: 'desc'}} })
        .exec((err, replies) => {
          if (err) return next(err);
          return res.send(replies);
        });
}

function getThreads(req, res, next) {
  const board_title = req.params.board;
  const select_fields = '-delete_password -reported -__v';
  Board.findOne({board_title})
    .populate({
      path: 'threads',
      select: select_fields,
      options: { sort: {bumped_on: 'desc'}, limit: 10},
      populate: {path: 'replies', select: select_fields, options: { sort: {created_on: 'desc'}, limit: 3}}
    })
    .exec((err, data) => {
      if (err) return next(err);
      if (data) {
        res.send(data.threads);
      } else {
        res.status(404).end();
      }
    });
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
