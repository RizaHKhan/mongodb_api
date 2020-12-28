const { ObjectId } = require("bson");

let air_routes;
let air_alliances;

class Airlines {
  static async injectDB(client) {
    if (air_routes && air_alliances) {
      return;
    } else {
      try {
        air_routes = await client.db("aggregations").collection("air_routes");
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
    // Chapetr 3 - Using $lookup
    // NOTES:
    // First we make sure that we're only pulling in documents that are of the target planes using $match
    // Then use lookup to pull in related air_alliance document under the object 'alliance'
    // Lookup pulls the entire document and attaches it to the the returned air_routes document
    // The airlines are includes in the airlines array in air_alliances
    // The unwind converst the results to an object
    //
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

    const routes = await air_routes.aggregate(pipeline).toArray();
    // const alliances = await air_alliances.findOne({});
    return { routes };
  }
}

module.exports = Airlines;
