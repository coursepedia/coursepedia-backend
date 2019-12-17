const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var commentSchema = new Schema(
  {
    content: String,
    users: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
    // courses: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Courses"
    // },
    // date: Date
  },
  {
    timestamps: true
  }
);

const Comments = mongoose.model("Comments", commentSchema);
module.exports = Comments;
