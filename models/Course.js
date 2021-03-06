const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  visible: { type: Boolean, required: true },
  contributors: { type: Array, default: [] },
  license: { type: String },
  directorys: { type: Array },
  language: { type: String, required: true },
  description: { type: String },
  picture: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Course", CourseSchema);
