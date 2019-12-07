const Thread = require('../models/Thread');
const Reply = require('../models/Reply');
const Board = require('../models/Board');

function postThread(req, res, next) {
  const board = req.params.board;
  const {text, delete_password} = req.body;

  const newThread = new Thread({text, delete_password, replies: []});
  newThread.save((err, data) => {
    if (err) return next(err);
    res.redirect('/b/' + board);
  });
}

function postReply(req, res) {
  res.send(`NOT IMPLEMENTED: Post reply to the board ${req.params.board} with text: ${req.body.text} and pw: ${req.body.delete_password}, thread_id: ${req.body.thread_id}`);
}


function reportThread(req, res, next) {
  const thread_id = req.body.thread_id;
  Thread.findByIdAndUpdate(thread_id, {reported: true}, (err) => {
    if (err) return next(err);
    res.send('success');
  });
}

function reportReply(req, res) {
  // set reported field to true
  res.send(`NOT IMPLEMENTED: Put, reporting reply in board: ${req.params.board} with thread_id: ${req.body.thread_id} and reply_id: ${req.body.reply_id}`);
}

function deleteThread(req, res) {
  //remove thread with replies completely
  res.send(`NOT IMPLEMENTED: Delete thread in board: ${req.params.board} with thread_id: ${req.body.thread_id} and delete_password: ${req.body.delete_password}`);
}

function deleteReply(req, res) {
  //remove reply by replacing text with [deleted]
  res.send(`NOT IMPLEMENTED: Delete reply in board: ${req.params.board}
    with thread_id: ${req.body.thread_id} and reply_id: ${req.body.reply_id} and delete_password: ${req.body.delete_password}`);
}

// getReplies from board with req.query.thread_id
function getReplies(req, res) {
  console.log('getting replies for: ' + req.params.board);
  res.send(`NOT IMPLEMENTED: Get replies for the thread_id ${req.query.thread_id}`);
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
