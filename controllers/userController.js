var bcrypt = require("bcryptjs");
var express = require("express");
var { check, body, validationResult } = require("express-validator");

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

    request.body.password = bcrypt.hashSync(request.body.password, 10);
    const user = await User.create(request.body);
    response.json(user);
  }
);

module.exports = router;
