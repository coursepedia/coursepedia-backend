//configurasi connection to mongoose
require("dotenv").config();

const mongoose = require("mongoose");
const NODE_ENV = process.env.NODE_ENV || "development";
const MONGODB_URI = NODE_ENV !== "development" ? process.env.MONGODB_URI : `mongodb://localhost:27017/coursepedia_development`;

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
