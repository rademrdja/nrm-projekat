const mongoose = require("mongoose");

const developerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  specialisation: { type: String, required: true },
});

module.exports = mongoose.model("Developer", developerSchema);
