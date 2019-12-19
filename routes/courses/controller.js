const objectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");

const Courses = require("../../models/course");

module.exports = {
  addCourse: async (req, res) => {
    const { name, address, phoneNumber, price, rating, ageCategory, fieldCategory, imageUrl } = req.body;
    if (!name || !address || !phoneNumber || !price || !rating || !ageCategory || !fieldCategory || !imageUrl) {
      return res.status(400).send({
        message: "body can't be empty"
      });
    }

    const existedCourse = await Courses.findOne({ name });

    console.log(existedCourse);

    if (existedCourse) {
      return res.status(409).send({
        message: `course ${existedCourse.name} already exist, please add another recommendation course`
      });
    } else {
      Courses.create(req.body)
        .then(result => {
          res.status(201).send({
            message: "course created",
            result
          });
        })
        .catch(error => {
          res.status(500).send({
            message: "adding course failed",
            error: error.message
          });
        });
    }
  },

  getAllCourse: (req, res) => {
    Courses.find({})
      .populate({
        path: "comments",
        populate: [{ path: "users", select: "username email -_id" }]
      })
      .then(result => {
        res.send(result);
      })
      .catch(error => {
        res.status(500).send({
          message: "There is no Course",
          error: error.message
        });
      });
  },

  getOneCourse: (req, res) => {
    Courses.findOne({ _id: objectId(req.params.id) })
      .then(result => {
        res.send(result);
      })
      .catch(error => {
        res.status(400).send({
          message: "Course doesn't exist",
          error: error.message
        });
      });
  },

  deleteCourse: async (req, res) => {
    const existedCourse = await Courses.findOne({ _id: objectId(req.params.id) });

    if (existedCourse) {
      Courses.findOneAndDelete(
        {
          _id: req.params.id
        },
        (error, result) => {
          try {
            res.status(200).send({
              message: "delete success",
              result
            });
          } catch (error) {
            res.status(401).send({
              message: "delete failed",
              error: error.message
            });
          }
        }
      );
    } else {
      res.status(400).send({
        message: "Course invalid",
        error: error.message
      });
    }
  },

  updateCourse: async (req, res) => {
    const existedCourse = await Courses.findOne({ name: req.body.name });

    if (existedCourse) {
      return res.status(409).send({
        message: `course ${existedCourse.name} already exist, please add another recommendation course`
      });
    } else {
      Courses.findOneAndUpdate(
        {
          _id: req.params.id
        },
        { name: req.body.name, address: req.body.address, phoneNumber: req.body.phoneNumber, price: req.body.price, rating: req.body.rating, ageCategory: req.body.ageCategory, fieldCategory: req.body.fieldCategory, imageUrl: req.body.imageUrl },
        (error, result) => {
          try {
            res.status(200).send({
              message: "Course updated",
              result
            });
          } catch (error) {
            res.status(401).send({
              message: "Failed to update",
              error: error.message
            });
          }
        }
      );
    }
  }
};
