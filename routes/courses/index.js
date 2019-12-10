require("dotenv").config();
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const { addCourse, getAllCourse, deleteCourse, getOneCourse, updateCourse } = require("../courses/controller");

router.post("/", auth, addCourse);
router.get("/", getAllCourse);
router.get("/:id", getOneCourse);
router.delete("/:id", auth, deleteCourse);
router.put("/:id", auth, updateCourse);

module.exports = router;
