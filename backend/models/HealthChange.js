const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define collection and schema for HealthChange
let HealthChange = new Schema(
  {
    userId: {
      type: String
    },
    eventDate: {
      type: Date
    },
    healthSignals: {
      type: [String]
    }
  },
  {
    collection: "health-change"
  }
);

module.exports = mongoose.model("HealthChange", HealthChange);
