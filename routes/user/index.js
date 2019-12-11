require("dotenv").config();
// var config = require("config");
var express = require("express");
var router = express.Router();
const auth = require("../../middleware/auth");

const { addUser, login, getUserById, getAllUser, deleteUser, updateUser } = require("./controller");

/* GET users listing. */
// router.get("/", function(req, res, next) {
//   res.send("respond with a resource");
// });

router.post("/", addUser);
router.post("/login", auth, login);
router.get("/:id", auth, getUserById);
router.get("/", getAllUser);
router.delete("/:id", auth, deleteUser);
router.put("/:id", auth, updateUser);

module.exports = router;
