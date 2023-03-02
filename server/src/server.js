const http = require("http");
require("dotenv").config();

const { mongoConnect } = require("./utils/mongo");
const app = require("./app");
const { loadPlanetData } = require("./models/planets.models");
const { getLaunchesData } = require("./models/launches.models");

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

async function startServer() {
  await mongoConnect();
  await loadPlanetData();
  await getLaunchesData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}
startServer();
