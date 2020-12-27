const Movies = require("../models/Movies");

class MoviesController {
  static async apiGetOneMovie(req, res, next) {
    const movies = await Movies.getOneMovie();
    res.send(movies);
  }

  static async apiGetAllMovies(req, res, next) {
    const movies = await Movies.getAllMovies();
    res.send(movies);
  }
}

module.exports = MoviesController;
