const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const movieController = require("../controllers/movieController");
const characterController = require("../controllers/characterController");

const middleware = require("./middleware");

router.use("/auth", userController);
router.use("/movies", middleware.checkToken, movieController);
router.use("/characters", middleware.checkToken, characterController);

module.exports = router;
