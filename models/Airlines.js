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

    // const routes = await air_routes.aggregate(pipeline).toArray();
    // const airlines = await air_airlines.aggregate(pipeline).toArray();
    const alliances = await air_alliances.aggregate(pipeline).toArray();
    console.log(alliances.length);
    return { alliances };
  }
}

module.exports = Airlines;

/*
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
