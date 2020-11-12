const mongoose = require("mongoose");

const StepSchema = mongoose.Schema({
  chapterId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  metadata: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Step", StepSchema);
