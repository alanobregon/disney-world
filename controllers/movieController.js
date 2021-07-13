var express = require("express");
var router = express.Router();
var { check, body, validationResult } = require("express-validator");

const { Movie, Gender } = require("../models");

router.get("/", async (request, response) => {
  const movies = await Movie.findAll({
    attributes: ["id", "title", "createdAt"],
    where: request.query,
  });

  response.status(200).json({
    movies,
  });
});

router.post(
  "/",
  [
    check("title", "title field is required").not().isEmpty(),
    check("score", "score field is required").not().isEmpty(),
    check("score", "score field require a number").isNumeric(),
    check("genderId", "genderId field is required").not().isEmpty(),
    check("genderId", "genderId field require a number").isNumeric(),
    body("genderId").custom((value) => {
      return Gender.findOne({ where: { id: value } }).then((gender) => {
        if (!gender) return Promise.reject("gender not found");
      });
    }),
  ],
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        message: "unprocessable entity",
        errors: errors.array(),
      });
    }

    const movie = await Movie.create(request.body);
    response.status(201).json({
      status: "created",
      movie,
    });
  }
);

router.get("/:id", async (request, response) => {
  const movie = await Movie.findOne({
    where: { id: request.params.id },
    include: ["gender", "characters"],
  });

  if (!movie) {
    return response.status(404).json({
      status: "not found",
      message: "movie not found",
    });
  }

  response.status(200).json({
    status: "ok",
    movie,
  });
});

router.put("/:id", async (request, response) => {
  const movie = await Movie.findOne({
    where: { id: request.params.id }
  })

  if (!movie) {
    return response.status(404).json({
      status: "not found",
      message: "movie not found",
    });
  }

  const { title, score, genderId } = request.body
  movie.update({
    title,
    score,
    genderId
  })

  movie.save();
  response.status(200).json({
    status: "ok",
    movie,
  })
});

router.delete("/:id", async (request, response) => {
  const movie = await Movie.findOne({
    where: { id: request.params.id },
  });

  if (!movie) {
    return response.status(404).json({
      status: "not found",
      message: "movie not found",
    });
  }

  movie.destroy();
  response.status(200).json({
    status: "ok",
    movie,
  });
});

module.exports = router;
