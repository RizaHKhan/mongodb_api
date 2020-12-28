const { Router } = require("express");
const airlinesController = require("../controller/airlinesController");
const router = new Router();

// /airlines
router.get("/", airlinesController.getRoutes);

module.exports = router;
