const mongoose = require("mongoose");

const UserFinishedCoursesSchema = mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "UserFinishedCourses",
  UserFinishedCoursesSchema
);
