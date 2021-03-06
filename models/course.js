const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var courseSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  address: String,
  phoneNumber: String,
  price: Number,
  rating: Number,
  ageCategory: String,
  fieldCategory: String,
  imageUrl: String,
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comments"
    }
  ]
});

const Courses = mongoose.model("Courses", courseSchema);
module.exports = Courses;
