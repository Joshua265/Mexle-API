const mongoose = require("mongoose");

const ChapterSchema = mongoose.Schema({
  title: { type: String, required: true },
  courseId: { type: String, required: true },
  author: { type: String, required: true },
  visible: { type: Boolean, required: true },
  description: { type: String },
  picture: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chapter", ChapterSchema);
