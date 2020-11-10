const mongoose = require("mongoose");

const UserFinishedStepsSchema = mongoose.Schema({
  userId: { type: String, required: true },
  stepId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserFinishedSteps", UserFinishedStepsSchema);
