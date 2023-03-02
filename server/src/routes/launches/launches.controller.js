const {
  launchExists,
  getAllLaunches,
  scheduleLaunches,
  abortLaunch,
} = require("../../models/launches.models");

const { pagination } = require("../../utils/pagination");

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = pagination(req.query);
  return res.status(200).json(await getAllLaunches(skip, limit));
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.launchDate ||
    !launch.mission ||
    !launch.target ||
    !launch.rocket
  ) {
    return res.status(400).json({
      error: "Missing properties required for launch",
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Incorrect Date",
    });
  }
  await scheduleLaunches(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const abortId = Number(req.params.id);
  const existingLaunch = await launchExists(abortId);
  if (!existingLaunch) {
    return res.status(404).json({
      error: "Launch does not exist.",
    });
  }

  const aborted = await abortLaunch(abortId);
  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted.",
    });
  }
  return res.status(200).json({
    ok: true,
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
