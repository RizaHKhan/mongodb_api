const { ObjectId } = require("bson");

let movies;

class Movies {
  static async injectDB(client) {
    if (movies) {
      return;
    } else {
      try {
        movies = await client.db("aggregations").collection("movies");
      } catch (e) {
        /* handle error */
        console.log(`Error occured: ${e}`);
      }
    }
  }

  static async getOneMovie() {
    try {
      const cursor = await movies
        .find({ countries: { $in: ["Canada"] } })
        .project({ title: 1, _id: 0 });
      return cursor.toArray();
    } catch (e) {
      return e;
    }
  }

  static async getAllMovies() {
    const pipeline = [
      {
        $group: {
          _id: {
            numDirectors: {
              $cond: [{ $isArray: "$directors" }, { $size: "$directors" }, 0],
            },
          },
          numFilms: { $sum: 1 },
          averageMetacritic: { $avg: "$metacritic" },
        },
      },
      {
        $match: {
          averageMetacritic: { $ne: null },
        },
      },
      {
        $sort: { "_id.numDirectors": -1 },
      },
    ];
    const cursor = await movies.aggregate(pipeline);
    return await cursor.toArray();
  }
}

module.exports = Movies;

/*

// Grouping documents by specified _id. In this case '$year'
const pipeline = [
  {
    $group: {
      _id: "$year",
      num_films_in_year: { $sum: 1 },
    },
  },
  {
    $sort: {
      num_films_in_year: -1,
    },
  },
];

//
const pipeline = [
  {
    $group: {
      _id: {
        numDirectors: {
          $cond: [{ $isArray: "$directors" }, { $size: "$directors" }, 0],
        },
      },
      numFilms: { $sum: 1 },
      averageMetacritic: { $avg: "$metacritic" },
    },
  },
  {
    $sort: { "_id.numDirectors": -1 },
  },
];
*/
