require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User, validate } = require("../../models/user");

module.exports = {
  // user register
  addUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(409).send({
          message: "body can't be empty"
        });
      }
      // validate the request body first
      const { error } = validate(req.body);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }

      //find an existing user
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).send("User already registered, please login");
      } else {
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(req.body.password, salt, async function(err, hash) {
            try {
              user = new User({
                username: req.body.username,
                password: hash,
                email: req.body.email
              });
              user.password = await bcrypt.hash(user.password, 10);
              await user.save();

              const token = user.generateAuthToken();
              res.header("x-auth-token", token).send({
                _id: user._id,
                username: user.username,
                email: user.email
                //   token
              });
              res.status(200).send({
                message: "created user success",
                user
              });
            } catch (error) {
              res.send({
                message: "Invalid password",
                error: error.message
              });
            }
          });
        });
      }
    } catch (error) {
      res.send({
        message: "create user failed",
        error: error.message
      });
    }
  },

  login: async (req, res) => {
    try {
      //   const { email, password } = req.body
      let user = await User.findOne({ email: req.body.email });
      //   const user = await user.findOne ({ where : { email } })
      let valid = bcrypt.compareSync(req.body.password, user.password);

      if (valid) {
        const token = await jwt.sign({ data: user }, process.env.JWT_PRIVATE, { expiresIn: "1h" });
        res.status(200).send({
          message: "login success",
          token,
          user
        });
      } else {
        res.status(400).send({
          message: "invalid username or password"
          //   error: error.message
        });
      }
    } catch (error) {
      res.status(400).send({
        message: "User doesn't exist",
        error: error.message
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-password");
      res.send(user);
    } catch (error) {
      res.send({
        error: error.message
      });
    }
  }
};
