const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

let ThreadSchema = new Schema({
  text:             {type: String, required: true},
  delete_password:  {type: String, required: true},
  created_on:       {type: Date, default: Date.now, required: true},
  bumped_on:        {type: Date, default: Date.now, required: true},
  reported:         {type: Boolean, default: false, required: true},
  replies:          [{type: Schema.Types.ObjectId, ref: 'Reply'}],
  replycount:       {type: Number, default: 0, required: true}
});

ThreadSchema.pre('save', function(next) {
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

ThreadSchema.post('remove', function(doc, next) {
  const Board = this.model('Board');
  const Reply = this.model('Reply');
  const delete_promise = Reply.deleteMany({_id: {$in: doc.replies}});
  const update_promise = Board.findOneAndUpdate({threads: doc._id},{$pull: {threads: doc._id}});
  Promise.all([delete_promise, update_promise])
    .then(data => {
      next();
    })
    .catch(err => next(err));
})

ThreadSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.delete_password, (err, res) => {
    if (err) return cb(err);
    cb(null, res);
  });
};

module.exports = mongoose.model('Thread', ThreadSchema);
