const mongoose = require("mongoose");

const FinishedCoursesSchema = mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FinishedCourses", FinishedCoursesSchema);
