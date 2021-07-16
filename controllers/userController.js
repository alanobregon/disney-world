var bcrypt = require("bcryptjs");
var express = require("express");
var { check, body, validationResult } = require("express-validator");

require("dotenv").config();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SG_APIKEY);

var jwt = require("jwt-simple");
var moment = require("moment");

const router = express.Router();
const { User } = require("../models");

router.post(
  "/register",
  [
    check("firstname", "first name is required").not().isEmpty(),
    check("lastname", "last name is required").not().isEmpty(),
    check("email", "email format is incorrect").isEmail(),
    check("password", "password must be at least 8 chars long").isLength({
      min: 8,
    }),
    body("email").custom((value) => {
      return User.findOne({ where: { email: value } }).then((user) => {
        if (user) return Promise.reject("email already exists");
      });
    }),
  ],
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        errors: errors.array(),
      });
    }

    const msg = {
      to: request.body.email,
      from: process.env.SG_SENDER_EMAIL,
      subject: "Welcome to Disney World App",
      html: "<strong>This message was sending with SendGrid and Node.js for Alkemy Labs' Backend Challenge with Node.js</strong>",
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("email sent");
      })
      .catch((error) => {
        console.log(error);
      });

    request.body.password = bcrypt.hashSync(request.body.password, 10);
    const user = await User.create(request.body);
    response.json(user);
  }
);

router.post("/login", async (request, response) => {
  const user = await User.findOne({ where: { email: request.body.email } });
  if (user) {
    const verification = bcrypt.compareSync(
      request.body.password,
      user.password
    );
    if (verification) {
      response.json({
        success: createToken(user),
      });
    } else {
      response.json({
        error: "email or password incorrect",
      });
    }
  } else {
    response.json({
      error: "email or password incorrect",
    });
  }
});

const createToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    createdAt: moment().unix(),
    expiredAt: moment().add(10, "minutes").unix(),
  };

  return jwt.encode(payload, "secretKey");
};

module.exports = router;
