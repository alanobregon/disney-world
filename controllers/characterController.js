var express = require("express");
var Op = require("sequelize").Op;
var router = express.Router();
var { check, body, validationResult } = require("express-validator");

const { Character, Movie } = require("../models");

router.get("/", async (request, response) => {
  const filter = {};
  if (request.query.name) {
    filter.name = { [Op.like]: `%${request.query.name}%` };
  }
  if (request.query.age) {
    filter.age = request.query.age;
  }
  if (request.query.movies) {
    const movie = await Movie.findOne({
      where: { id: request.query.movies },
    });

    if (!movie) {
      return response.status(404).json({
        status: "not found",
        message: "movie not found",
      });
    }

    return response.json({
      characters: await movie.getCharacters({
        where: filter,
      }),
    });
  }

  const characters = await Character.findAll({
    attributes: ["id", "name"],
    where: filter,
  });
  
  response.json({
    characters,
  });
});

router.post(
  "/",
  [
    check("name", "name field is required").not().isEmpty(),
    check("age", "age field is required").not().isEmpty(),
    check("age", "age field require a number").isNumeric(),
    check("weight", "weight field is required").not().isEmpty(),
    check("weight", "weight field required a number").isNumeric(),
    check("story", "story field is required").not().isEmpty(),
    check("story", "story field must be have up to 300 chars long").isLength({
      max: 300,
    }),
  ],
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        errors: errors.array(),
      });
    }

    const character = await Character.create(request.body);
    response.json({
      message: "character created successfully",
      character,
    });
  }
);

router.get("/:id", async (request, response) => {
  const character = await Character.findOne({
    where: { id: request.params.id },
    attributes: ["id", "name", "age", "weight", "createdAt", "updatedAt"],
    include: [
      {
        model: Movie,
        as: "movies",
        attributes: ["id", "title"],
      },
    ],
  });

  if (!character) {
    return response.status(404).json({
      message: "character not found",
    });
  }

  response.json({
    character,
  });
});

router.put("/:id", async (request, response) => {
  const character = await Character.findOne({
    where: { id: request.params.id },
  });

  if (!character) {
    return response.status(404).json({
      message: "character not found",
    });
  }

  character.update(request.body, {
    returning: true,
    plain: true,
  });

  response.json({
    message: "character updated successfully",
    character,
  });
});

router.put("/:id/movies/add", async (request, response) => {
  const character = await Character.findOne({
    where: { id: request.params.id },
  });

  if (!character) {
    return response.status(404).json({
      status: "not found",
      message: "character not found",
    });
  }

  const { movies } = request.body;
  if (!movies) {
    return response.status(404).json({
      status: "not found",
      message: "movies data is empty",
    });
  }

  movies.map(async (movie) => {
    if (!(await character.hasMovie(movie))) {
      character.addMovie(movie);
    }
  });

  response.status(200).json({
    status: "ok",
    message: "movies added successfully",
  });
});

router.put("/:id/movies/remove", async (request, response) => {
  const character = await Character.findOne({
    where: { id: request.params.id },
  });

  if (!character) {
    return response.status(404).json({
      status: "not found",
      message: "character not found",
    });
  }

  const { movies } = request.body;
  if (!movies) {
    return response.status(404).json({
      status: "not found",
      message: "movies data is empty",
    });
  }

  movies.map(async (movie) => {
    if (await character.hasMovie(movie)) {
      character.removeMovie(movie);
    }
  });

  response.status(200).json({
    status: "ok",
    message: "movies removed successfully",
  });
});

router.delete("/:id", async (request, response) => {
  const character = await Character.findOne({
    where: { id: request.params.id },
  });

  if (!character) {
    return response.status(404).json({
      message: "character not found",
    });
  }

  character.destroy();
  response.json({
    message: "character deleted successfully",
    character,
  });
});

module.exports = router;
