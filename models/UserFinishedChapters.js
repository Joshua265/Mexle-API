const mongoose = require("mongoose");

const UserFinishedChaptersSchema = mongoose.Schema({
  userId: { type: String, required: true },
  chapterId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "UserFinishedChapters",
  UserFinishedChaptersSchema
);
