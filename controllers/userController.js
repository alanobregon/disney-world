var express = require("express");
var router = express.Router();

router.get("/", (request, response, next) => {
  response.status(200).send({
    message: "users",
  });
});

module.exports = router;
