const launches = require("./launches.mongo");
const planets = require("./planets.mango");

const axios = require("axios");

const SPACE_X_URL = "https://api.spacexdata.com/v4/launches/query";
let DEFAULT_FLIGHT_NUMBER = 100;

async function populateLaunches() {
  console.log("Downloading SpaceX API Data...");
  const response = await axios.post(SPACE_X_URL, {
    query: "",
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: "name",
        },
        {
          path: "payloads",
          select: "customers",
        },
      ],
    },
  });
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customer = payloads.flatMap((payload) => payload["customers"]);
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      success: launchDoc["success"],
      upcoming: launchDoc["upcoming"],
      customer,
    };
    await saveLaunches(launch);
  }
}

async function getLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Launch data already loaded");
  } else {
    await populateLaunches();
  }
}

async function getAllLaunches(skip, limit) {
  return await launches
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .sort("flightNumber")
    .skip(skip)
    .limit(limit);
}

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function launchExists(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}

async function saveLaunches(launch) {
  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function latestFlightNumber() {
  const latestLaunch = await launches.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

// function addNewLaunch(launch) {
//   latestflightNumber++;
//   return launches_map.set(
//     latestflightNumber,
//     Object.assign(launch, {
//       flightNumber: latestflightNumber,
//       customer: ["ZTM", "NASA"],
//       upcoming: true,
//       success: true,
//     })
//   );
// }

async function scheduleLaunches(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("Planet was not found!");
  }

  const latestFlight = (await latestFlightNumber()) + 1;
  const launchData = Object.assign(launch, {
    flightNumber: latestFlight,
    success: true,
    upcoming: true,
    customer: ["ZTM", "NASA"],
  });
  await saveLaunches(launchData);
}

async function abortLaunch(launchId) {
  const aborted = await launches.updateOne(
    {
      flightNumber: launchId,
    },
    {
      success: false,
      upcoming: false,
    }
  );
  return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

module.exports = {
  getLaunchesData,
  launchExists,
  getAllLaunches,
  scheduleLaunches,
  abortLaunch,
};
