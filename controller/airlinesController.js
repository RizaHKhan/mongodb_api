const Airlines = require("../models/Airlines");

class AirlinesController {
  static async getRoutes(req, res, next) {
    try {
      const results = await Airlines.routeLookup();
      res.send(results);
    } catch (e) {
      res.send(`An error occureed ${e}`);
    }
  }
}

module.exports = AirlinesController;
