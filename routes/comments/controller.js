const objectId = require("mongodb").ObjectId;

const { User } = require("../../models/user");
const Courses = require("../../models/course");
const Comments = require("../../models/comment");

module.exports = {
  addCommentToPostByUser: async (req, res) => {
    try {
      const { users, courseId, content } = req.body;
      console.log(req.body);

      const newComment = await Comments.create({
        content,
        users
      });
      const user = await User.findOne({ _id: objectId(users) });
      const course = await Courses.findOneAndUpdate(
        { _id: objectId(courseId) },
        { $push: { comments: newComment._id } },
        { new: true }
      );

      return res.status(201).json({
        message: `adding comment from ${user.username} success. Thank you for your comment.`,
        newComment
      });
      //   if (newComment) {
      //     const user = await Comment.findOneAndUpdate({ _id: users }, { $push: { comments: newComment._id } }, { new: true });
      //     return res.status(201).json({
      //       message: `adding comment from ${user.username} success. Thank you for your comment.`
      //     });
      //   } else {
      //     res.status(409).json({
      //       message: "adding comment failed",
      //       error: error.message
      //     });
      //   }
    } catch (error) {
      res.send({
        message: "comment route error",
        error: error.message
      });
    }
  },

  deleteComment: async (req, res) => {
    const existedComment = await Comment.findOne({
      _id: objectId(req.params.id)
    });

    if (existedComment) {
      Comment.findOneAndDelete(
        {
          _id: req.params.id
        },
        (error, result) => {
          try {
            res.status(200).send({
              message: "comment deleted",
              result
            });
          } catch (error) {
            res.status(401).send({
              message: "delete comment failed",
              error: error.message
            });
          }
        }
      );
    } else {
      res.status(400).send({
        message: "Invalid comments",
        error: error.message
      });
    }
  },

  getAllComments: (req, res) => {
    try {
      Comments.find({})
        .populate({
          path: "users",
          select: "username email -_id"
        })
        // .populate({
        //   path: "courses",
        //   select: "username email -_id"
        // })
        .then(result => res.send(result))
        .catch(error => res.send(error));
    } catch (error) {
      res.status(400).send({
        message: "No comments at all",
        error: error.message
      });
    }
  },

  updateComment: (req, res) => {
    Comments.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then(result => res.send({ message: "edit comment succcess", result }))
      .catch(error =>
        res.send({ message: "failed to edit comment", error: error.message })
      );
  }
};
