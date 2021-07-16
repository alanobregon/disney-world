var express = require("express");
var Op = require("sequelize").Op;
var router = express.Router();
var { check, body, validationResult } = require("express-validator");

const { Movie, Gender, Character } = require("../models");

router.get("/", async (request, response) => {
  const filter = {};
  let order = "ASC";

  if (request.query.title) {
    filter.title = { [Op.like]: `%${request.query.title}%` };
  }
  if (request.query.gender) {
    filter.genderId = request.query.gender;
  }
  if (request.query.order) {
    order = request.query.order;
  }

  const movies = await Movie.findAll({
    attributes: ["id", "title", "createdAt"],
    where: filter,
    order: [
      [ "id", order]
    ],
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
    check("score", "score field must be a number between 1 and 5").isFloat({
      min: 1,
      max: 5,
    }),
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
    attributes: ["id", "title", "score", "createdAt", "updatedAt"],
    include: [
      {
        model: Gender,
        as: "gender",
        attributes: ["id", "name"],
      },
      {
        model: Character,
        as: "characters",
        attributes: ["id", "name"],
      },
    ],
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
    where: { id: request.params.id },
  });

  if (!movie) {
    return response.status(404).json({
      status: "not found",
      message: "movie not found",
    });
  }

  movie.update(request.body, {
    returning: true,
    plain: true,
  });

  response.status(200).json({
    status: "ok",
    movie,
  });
});

router.put("/:id/characters/add", async (request, response) => {
  const movie = await Movie.findOne({
    where: { id: request.params.id },
  });

  if (!movie) {
    return response.status(404).json({
      status: "not found",
      message: "movie not found",
    });
  }

  const { characters } = request.body;
  if (!characters) {
    return response.status(404).json({
      status: "not found",
      message: "characters data is empty",
    });
  }

  characters.map(async (character) => {
    if (!(await movie.hasCharacter(character))) {
      movie.addCharacter(character);
    }
  });

  response.status(200).json({
    status: "ok",
    message: "characters added successfully",
  });
});

router.put("/:id/characters/remove", async (request, response) => {
  const movie = await Movie.findOne({
    where: { id: request.params.id },
  });

  if (!movie) {
    return response.status(404).json({
      status: "not found",
      message: "movie not found",
    });
  }

  const { characters } = request.body;
  if (!characters) {
    return response.status(404).json({
      status: "not found",
      message: "characters data is empty",
    });
  }

  characters.map(async (character) => {
    if (await movie.hasCharacter(character)) {
      movie.removeCharacter(character);
    }
  });

  response.status(200).json({
    status: "ok",
    message: "characters removed successfully",
  });
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

  movie.destroy({ cascade: true });
  response.status(200).json({
    status: "ok",
    movie,
  });
});

module.exports = router;
