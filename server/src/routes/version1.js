const express = require("express");

const version1Router = express.Router();

const planetsRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");

version1Router.use("/planets", planetsRouter);
version1Router.use("/launches", launchesRouter);

module.exports = version1Router;
