require("dotenv").config();
// const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const { User, validateUser } = require("../../models/user");

module.exports = {
	// user register
	addUser: async (req, res) => {
		try {
			const { username, email, password } = req.body;
			if (!username || !email || !password) {
				return res.status(409).send({
					message: "field can't be empty"
				});
			}
			// validate the request body first
			const { error } = validateUser(req.body);
			if (error) {
				return res.status(400).send({ message: error.details[0].message });
			}

			//find an existing user
			let user = await User.findOne({ email: req.body.email });
			if (user) {
				return res.status(400).send({ message: "User already registered, please login" });
			} else {
				bcrypt.genSalt(10, function(err, salt) {
					bcrypt.hash(req.body.password, salt, async function(err, hash) {
						try {
							user = new User({
								username: req.body.username,
								email: req.body.email,
								password: hash
							});
							// user.password = await bcrypt.hash(user.password, 10);
							await user.save();

							// const token = user.generateAuthToken();
							// res.header("x-auth-token", token).send({
							//   _id: user._id,
							//   username: user.username,
							//   email: user.email
							//   //   token
							// });
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
		let user = await User.findOne({ email: req.body.email });
		if (!user) {
			throw new Error("user is not exist");
		}

		let valid = await bcrypt.compare(req.body.password, user.password);
		try {
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
					// error: error.message
				});
				throw new Error("Invalid password");
			}
		} catch (error) {
			res.status(400).send({
				message: "User doesn't exist",
				error: error.message
			});
		}
	},

	getAllUser: (req, res) => {
		User.find({})
			.then(result => {
				res.send(result);
			})
			.catch(error => console.log(error));
	},

	getUserById: async (req, res) => {
		try {
			const user = await User.findById(req.params.id).select("-password");
			res.send(user);
		} catch (error) {
			res.send({
				error: error.message
			});
		}
	},

	deleteUser: async (req, res) => {
		try {
			User.findOneAndDelete(
				{
					_id: req.params.id
				},
				{
					rawResult: false
				}
			)
				.then(result =>
					res.send({
						message: "user deleted",
						User
					})
				)
				.catch(error =>
					res.send({
						message: "delete user failed",
						error: error.message
					})
				);
		} catch (error) {
			res.send({
				error: error.message
			});
		}
	},

	updateUser: (req, res) => {
		User.findOneAndUpdate(
			{
				_id: req.params.id
			},
			{
				username: req.body.username,
				password: req.body.password,
				email: req.body.email
			},
			function(err, result) {
				if (err) {
					res.status(400).send({
						message: "error for updated",
						err
					});
				} else {
					res.status(200).send({
						message: "update success",
						result
					});
				}
			}
		);
	},

	sendEmailToUser: async (req, res) => {
		let transporter = nodemailer.createTransport({
			service: "gmail",
			secure: false, // true for 465, false for other ports
			auth: {
				user: "ladagakomodo@gmail.com", // generated ethereal user
				pass: "ladagaKomodo11!" // generated ethereal password
			}
		});

		let message = {
			from: "LaDaGa  👻 <ladagakomodo@gmail.com>",
			to: req.body.email,
			subject: req.body.subject,
			text: "Thanks for contacting us",
			html: "<p>Thanks for contacting us</p>",
			amp: `<!doctype html>
      <html ⚡4email>
        <head>
          <meta charset="utf-8">
          <style amp4email-boilerplate>body{visibility:hidden}</style>
          <script async src="https://cdn.ampproject.org/v0.js"></script>
          <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
        </head>
        <body>
          <p>Image: <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
          <p>GIF (requires "amp-anim" script in header):<br/>
            <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
        </body>
      </html>`
		};

		await transporter.sendMail(message, err => {
			if (err) {
				res.status(400).send({
					message: "error send email to user"
				});
			} else {
				res.status(200).send({
					message: "email sent!"
				});
			}
		});
	}
};
