require("dotenv").config();
// var config = require("config");
var express = require("express");
var router = express.Router();
const auth = require("../../middleware/auth");

const { addUser, login, getUserById, getAllUser, deleteUser, updateUser, sendEmailToUser } = require("./controller");

router.post("/", addUser);
router.post("/login", login);
router.post("/send-email-to-user", sendEmailToUser);
router.get("/:id", auth, getUserById);
router.get("/", getAllUser);
router.delete("/:id", auth, deleteUser);
router.put("/:id", auth, updateUser);

module.exports = router;
