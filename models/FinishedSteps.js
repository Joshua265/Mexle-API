const mongoose = require("mongoose");

const FinishedStepSchema = mongoose.Schema({
  userId: { type: String, required: true },
  stepId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FinishedSteps", FinishedStepSchema);
