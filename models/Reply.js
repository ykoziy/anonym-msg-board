const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

let ReplySchema = new Schema({
  text:             String,
  delete_password:  String,
  created_on:       {type: Date, default: Date.now},
  reported:         {type: Boolean, default: false}
});

ReplySchema.pre('save', function(next) {
  if (!this.isModified('delete_password')) {
    return next();
  }
  return bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(this.delete_password, salt, (err, hash) => {
      if (err) return next(err);
        this.delete_password = hash;
        return next();
    });
  });
});

ReplySchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.delete_password, (err, res) => {
    if (err) return cb(err);
    cb(null, res);
  });
};

module.exports = mongoose.model("Reply", ReplySchema);
