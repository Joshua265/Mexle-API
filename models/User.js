const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: false },
  role: { type: String, default: "user" },
  finishedCourses: { type: Array, default: [] },
  finishedChapters: { type: Array, default: [] },
  finishedSteps: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
