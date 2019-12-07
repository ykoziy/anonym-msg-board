const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ThreadSchema = new Schema({
  text:             String,
  delete_password:  String, //temp solution, should be shashed
  created_on:       {type: Date, default: Date.now},
  bumped_on:        {type: Date, default: Date.now},
  reported:         {type: Boolean, default: false},
  replies:          {type: Schema.Types.ObjectId, ref: 'Reply'}
});
//// Store board title???????
/// Recomend res.redirect to board page /b/{board}

module.exports = mongoose.model('Thread', ThreadSchema);
