//configurasi connection to mongoose
require("dotenv").config();

const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost:27017/test `;

// console.log(process.env);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
  //   promiseLibrary: global.Promise
});

const db = mongoose.connection;
module.exports = db;
