const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const shortid = require('shortid');
const Schema = mongoose.Schema;

let ReplySchema = new Schema({
  _id:              {type: String, default: shortid.generate},
  text:             {type: String, required: true},
  delete_password:  {type: String, required: true},
  created_on:       {type: Date, default: Date.now, required: true},
  reported:         {type: Boolean, default: false, required: true}
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
