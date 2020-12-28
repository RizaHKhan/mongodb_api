require("dotenv").config();
const app = require("./app.js");
const { MongoClient } = require("mongodb");
const Movies = require("./models/Movies.js");
const Airlines = require("./models/Airlines.js");

const PORT = process.env.PORT;

MongoClient.connect(process.env.CONNECTION_MOVIES, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    Movies.injectDB(client);
    Airlines.injectDB(client);
    app.listen(PORT, () => {
      console.log(
        `Database connection established and listening on port ${PORT}`
      );
    });
  })
  .catch((e) => console.log(e));
