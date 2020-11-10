const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { jsonParser } = require("../../middlewares");
const User = require("../../models/User");

// /login
router.post("/login", jsonParser, async (req, res) => {
  try {
    const user = {
      username: req.body.username,
      password: req.body.password,
    };
    const userData = await User.find(user);
    if (userData.length === 0) {
      res.status(400).json({ message: "Wrong Username or Password!" });
      return;
    }
    const token = jwt.sign({ user }, "secretkey", { expiresIn: "30s" });
    res.json({
      token,
      userData,
    });
  } catch (err) {
    res.json({ message: err });
  }
});

// /signup
// creates user
router.post("/signup", jsonParser, async (req, res) => {
  try {
    //check if user already exists
    users = await User.find({ username: req.body.username });
    if (users.length > 0) {
      res.status(400).json("User with that username already exists!");
      return;
    }
    const user = new User({
      username: req.body.username,
      email: req.body.email || "",
      password: req.body.password,
    });

    await user.save();
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
