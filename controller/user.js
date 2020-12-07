const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { findOneAndUpdate } = require("../models/User");

require("dotenv/config");

const login = async (req, res) => {
  try {
    const user = {
      username: req.body.username,
      password: req.body.password,
    };
    const userData = await User.findOne(user);
    if (userData.length === 0) {
      res.status(400).json({ message: "Wrong Username or Password!" });
      return;
    }
    const token = jwt.sign(
      { username: userData.username, role: userData.role },
      process.env.accessTokenSecret,
      { expiresIn: "4h" }
    );
    delete userData.password;
    res.status(200).json({
      token,
      userData,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const signUp = async (req, res) => {
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
};

const addFinished = async (req, res) => {
  try {
    const filter = { username: req.user.username };
    let update;
    switch (req.body.type) {
      case "course": {
        update = { $addToSet: { finishedCourses: req.body.finishedObject } };
        break;
      }
      case "chapter": {
        update = { $addToSet: { finishedChapter: req.body.finishedObject } };
        break;
      }
      case "step": {
        update = { $addToSet: { finishedSteps: req.body.finishedObject } };
        break;
      }
      default: {
        res.status(400).json({ message: "Invalid Type" });
        return;
      }
    }

    await User.findOneAndUpdate(filter, update, { useFindAndModify: false });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const autoLogin = async (req, res) => {
  try {
    const userData = await User.findOne({ username: req.user.username });
    if (userData.length === 0) {
      res.status(400).json({ message: "Wrong Username or Password!" });
      return;
    }
    const token = jwt.sign(
      { username: userData.username, role: userData.role },
      process.env.accessTokenSecret,
      { expiresIn: "4h" }
    );
    res.status(200).json({
      token,
      userData,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = { login, signUp, addFinished, autoLogin };
