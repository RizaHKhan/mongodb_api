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
      const pipeline = [
        {
          $project: {
            _id: 0,
            title: {
              $size: {
                $split: ["$title", " "],
              },
            },
          },
        },
        {
          $match: {
            title: {
              $eq: 1,
            },
          },
        },
        {
          $group: {
            _id: null,
            count: {
              $sum: 1,
            },
          },
        },
      ];

      const cursor = await movies.aggregate(pipeline).toArray();

      return { cursor };
    } catch (e) {
      console.log(e);
    }
  }

  static async getAllMovies() {
    const pipeline = [
      {
        $match: {
          "imdb.rating": {
            $gte: 7,
          },
          genres: {
            $ne: ["Crime", "Horror"],
          },
          rated: {
            $in: ["PG", "G"],
          },
          languages: {
            $in: ["English", "Japanese"],
          },
        },
      },
    ];
    const cursor = await movies.aggregate(pipeline);

    return await cursor.toArray();
  }
}

module.exports = Movies;

/*


const pipeline = [
  {
    $match: {
    rating at least 7
      "imdb.rating": {
        $gte: 7,
      },
      Array that does NOT include these items
      genres: {
        $nin: ["Crime", "Horror"],
      },
      Is PG or G
      rated: {
        $in: ["PG", "G"],
      },
      is Japanese and English
      languages: {
        $all: ["English", "Japanese"],
      },
    },
  },
]

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
