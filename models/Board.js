const mongoose = require("mongoose");
const shortid = require('shortid');
const Schema = mongoose.Schema;

let BoardSchema = new Schema({
  board_title:  {type: String, required: true},
  threads:      [{type: String, ref: 'Thread'}]
});

module.exports = mongoose.model('Board', BoardSchema);
