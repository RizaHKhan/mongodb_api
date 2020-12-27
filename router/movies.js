const { Router } = require("express");
const moviesController = require("../controller/moviesController");
const router = new Router();

router.get("/", moviesController.apiGetOneMovie);
router.get("/all", moviesController.apiGetAllMovies);

module.exports = router;
