const { getAllPlanets } = require("../../models/planets.models");

async function httpGetAllPlanets(req, res) {
  return res.status(201).json(await getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};
