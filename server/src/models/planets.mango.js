const { default: mongoose } = require("mongoose");
const mangoose = require("mongoose");

const planetsSchema = new mangoose.Schema({
  keplerName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Planet", planetsSchema);
