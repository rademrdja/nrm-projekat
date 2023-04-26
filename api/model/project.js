const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  durationInMonths: { type: Number, default: 3 },
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Developer",
    required: true,
  },
});

module.exports = mongoose.model("Project", projectSchema);
