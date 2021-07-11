const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const movieController = require("../controllers/movieController");
const characterController = require("../controllers/characterController");

router.use("/auth", userController);
router.use("/movies", movieController);
router.use("/characters", characterController);

module.exports = router;