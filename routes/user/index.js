require("dotenv").config();
// var config = require("config");
var express = require("express");
var router = express.Router();
const auth = require("../../middleware/auth");

const { addUser, getUserById, login } = require("./controller");

/* GET users listing. */
// router.get("/", function(req, res, next) {
//   res.send("respond with a resource");
// });

router.get("/:id", auth, getUserById);
router.post("/", addUser);
router.post("/login", login);

module.exports = router;
