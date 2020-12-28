const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const moviesRouter = require("./router/movies");
const airlinesRouter = require("./router/airlines");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/movies", moviesRouter);
app.use("/airlines", airlinesRouter);

module.exports = app;
