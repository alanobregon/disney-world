var express = require("express");
var router = express.Router();

const { Movie } = require("../models")

router.get("/", async (request, response) => {
  const movies = await Movie.findAll();
  response.json(movies)
    
});

module.exports = router;
