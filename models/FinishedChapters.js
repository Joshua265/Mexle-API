const mongoose = require("mongoose");

const FinishedChaptersSchema = mongoose.Schema({
  userId: { type: String, required: true },
  chapterId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FinishedChapters", FinishedChaptersSchema);
