const mongoose = require("mongoose");

const StepSchema = mongoose.Schema({
  chapterId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  visible: { type: Boolean, required: true },
  description: { type: String },
  content: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Step", StepSchema);
