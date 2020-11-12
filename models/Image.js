const mongoose = require("mongoose");

const Image = new mongoose.Schema({
  path: { type: String },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("image", Image);
