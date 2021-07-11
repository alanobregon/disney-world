var express = require("express");
var router = express.Router();

const { Character } = require("../models")

router.get("/", async (request, response, next) => {
  const characters = await Character.findAll();
  response.json(characters);
});

module.exports = router;
