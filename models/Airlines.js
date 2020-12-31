const { ObjectId } = require("bson");

let air_routes;
let air_alliances;
let air_airlines;

class Airlines {
  static async injectDB(client) {
    if (air_routes && air_alliances && air_airlines) {
      return;
    } else {
      try {
        air_routes = await client.db("aggregations").collection("air_routes");
        air_airlines = await client
          .db("aggregations")
          .collection("air_airlines");
        air_alliances = await client
          .db("aggregations")
          .collection("air_alliances");
      } catch (e) {
        /* handle error */
        console.log(`Error occured: ${e}`);
      }
    }
  }

  static async routeLookup() {
    const pipeline = [
      {
        $match: {
          dst_airport: { $in: ["JFK", "LHR"] },
          src_airport: { $in: ["JFK", "LHR"] },
        },
      },
      {
        $lookup: {
          from: "air_alliances",
          foreignField: "airlines",
          localField: "airline.name",
          as: "alliance",
        },
      },
      {
        $match: {
          alliance: { $ne: [] },
        },
      },
      {
        $addFields: {
          alliance: { $arrayElemAt: ["$alliance.name", 0] },
        },
      },
      {
        $group: {
          _id: "$airline.id",
          alliance: { $first: "$alliance" },
        },
      },
      {
        $sortByCount: "$alliance",
      },
    ];

    // const routes = await air_routes.aggregate(pipeline).toArray();
    // const airlines = await air_airlines.aggregate(pipeline).toArray();
    // const alliances = await air_alliances.aggregate(pipeline).toArray();
    const routes = await air_routes.aggregate(pipeline).toArray();
    return { routes };
  }
}

module.exports = Airlines;

/*


const pipeline = [
  Get only routes that are starting/stopping from the following two airports
  {
    $match: {
      dst_airport: { $in: ["JFK", "LHR"] },
      src_airport: { $in: ["JFK", "LHR"] },
    },
  },

  Then lookup into the air_alliance collection, matching member airline names in the airlines field to the local airline.name field in the route
  {
    $lookup: {
      from: "air_alliances",
      foreignField: "airlines",
      localField: "airline.name",
      as: "alliance",
    },
  },


  We follow the $match stage to remove routes that are not member of an alliance. We use $addFields to cast just the name of the allinace and extract a single element in one go.
  {
    $match: {
      alliance: { $ne: [] },
    },
  },

  {
    $addFields: {
      alliance: { $arrayElemAt: ["$alliance.name", 0] },
    },
  },

  Group by airline.id since we don't want to count the same airline twice. We take the first alliance name to avoid duplicates.
  Then, we use $sortByCount to get our answer from the results
  {
    $group: {
      _id: "$airline.id",
      alliance: { $first: "$alliance" },
    },
  },

  This produces the following output
  {
    $sortByCount: "$alliance",
  },
];

const pipeline = [
  {
    $match: { name: "OneWorld" },
  },
  {
    $graphLookup: {
      startWith: "$airlines",
      from: "air_airlines",
      connectFromField: "name",
      connectToField: "name",
      as: "airlines",
      maxDepth: 0,
      restrictSearchWithMatch: {
        country: { $in: ["Germany", "Spain", "Canada"] },
      },
    },
  },
  {
    $graphLookup: {
      startWith: "$airlines.base",
      from: "air_routes",
      connectFromField: "dst_airport",
      connectToField: "src_airport",
      as: "connections",
      maxDepth: 1,
    },
  },
  {
    $project: {
      validAirlines: "$airlines.name",
      "connections.dst_airport": 1,
      "connections.airline.name": 1,
    },
  },
  {
    $unwind: "$connections",
  },
  {
    $project: {
      isValid: {
        $in: ["$connections.airline.name", "$validAirlines"],
      },
      "connections.dst_airport": 1,
    },
  },
  {
    $match: { isValid: true },
  },
  {
    $group: {
      _id: "$connections.dst_airport",
    },
  },
];



Chapetr 3 - Using graphLookup
1. List all the possible destinations with at most one layover departing from Germany, Spain and Canada that are  part of the 'OneWorld' alliance.
2. Include both destination and which airline services that location.
3. Hint, 158 destinations

This is hitting the air_alliances

Chapetr 3 - Using $lookup
NOTES:
First we make sure that we're only pulling in documents that are of the target planes using $match
Then use lookup to pull in related air_alliance document under the object 'alliance'
Lookup pulls the entire document and attaches it to the the returned air_routes document
The airlines are includes in the airlines array in air_alliances
The unwind converst the results to an object

const pipeline = [
  {
    $match: {
      airplane: /747|380/,
    },
  },
  {
    $lookup: {
      from: "air_alliances",
      foreignField: "airlines",
      localField: "airline.name",
      as: "alliance",
    },
  },
  {
    $unwind: "$alliance",
  },
  {
    $group: {
      _id: "$alliance.name",
      count: { $sum: 1 },
    },
  },
  {
    $sort: {
      count: -1,
    },
  },
];
*/
