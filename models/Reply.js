const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ReplySchema = new Schema({
  text:             String,
  delete_password:  String,
  created_on:       {type: Date, default: Date.now},
  reported:         {type: Boolean, default: false}
});

module.exports = mongoose.model("Reply", ReplySchema);
