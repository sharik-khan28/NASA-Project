const express = require("express");
const cors = require("cors");
const path = require("path");
const version1Router = require("./routes/version1");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/v1", version1Router);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
