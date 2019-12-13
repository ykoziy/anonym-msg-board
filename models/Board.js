const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let BoardSchema = new Schema({
  board_title:  {type: String, required: true},
  threads:      [{type: Schema.Types.ObjectId, ref: 'Thread'}]
});

module.exports = mongoose.model('Board', BoardSchema);
