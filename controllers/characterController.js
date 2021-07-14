var express = require("express");
var router = express.Router();
var { check, body, validationResult } = require("express-validator");

const { Character, Movie } = require("../models");

router.get("/", async (request, response) => {
  const characters = await Character.findAll({
    attributes: ["id", "name"],
    where: request.query,
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

  const { name, age, weight, story } = request.body;
  character.update({
    name,
    age,
    weight,
    story,
  });

  character.save();
  response.json({
    message: "character updated successfully",
    character,
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
