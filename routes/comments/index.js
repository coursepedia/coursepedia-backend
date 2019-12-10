var express = require("express");
var router = express.Router();
const auth = require("../../middleware/auth");

const { getAllComments, deleteComment, addCommentToPostByUser } = require("./controller");

router.post("/", addCommentToPostByUser);
router.get("/", getAllComments);
router.delete("/:id", deleteComment);

module.exports = router;
