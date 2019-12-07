const mongoose = require('mongoose');
const options = {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false};

mongoose.connect(process.env.DB, options).
  catch(err => {
    console.log('Connection error: ' + error);
    process.exit(1);
  });

  mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection is open.');
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected.');
  });

  mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));

  process.on('SIGINT', () => {
  mongoose.disconnect(() => {
    console.log('Mongoose default connection disconnected through app termination.');
    process.exit(0);
  });
});
