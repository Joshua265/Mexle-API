const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String },
  coins: { type: Number, default: 0 },
  avatar: { type: String, default: undefined },
  role: { type: String, default: "user" },
  language: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
