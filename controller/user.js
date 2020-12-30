const User = require("../models/User");
const FinishedChapters = require("../models/FinishedChapters");
const FinishedSteps = require("../models/FinishedSteps");
const FinishedCourses = require("../models/FinishedCourses");
const jwt = require("jsonwebtoken");

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
      { _id: userData._id, username: userData.username, role: userData.role },
      process.env.accessTokenSecret,
      { expiresIn: "4h" }
    );
    const finishedCourses = await FinishedCourses.find({
      userId: userData._id,
    });

    const finishedChapters = await FinishedChapters.find({
      userId: userData._id,
    });

    const finishedSteps = await FinishedSteps.find({
      userId: userData._id,
    });

    res.status(200).json({
      token,
      userData: {
        language: userData.language,
        finishedCourses: finishedCourses,
        finishedChapters: finishedChapters,
        finishedSteps: finishedSteps,
      },
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
    switch (req.body.type) {
      case "course": {
        if (
          await FinishedCourses.findOne({
            courseId: req.body.finishedObject.id,
          })
        ) {
          res.sendStatus(400).json({ message: "Course already finished" });
          return;
        }
        const finishedCourse = new FinishedCourses({
          userId: req.user._id,
          courseId: req.body.finishedObject.id,
        });
        await finishedCourse.save();
        res.sendStatus(204);
        return;
      }
      case "chapter": {
        if (
          await FinishedChapters.findOne({
            chapterId: req.body.finishedObject.id,
          })
        ) {
          res.status(400).json({ message: "Chapter already finished" });
          return;
        }
        const finishedChapter = new FinishedChapters({
          userId: req.user._id,
          chapterId: req.body.finishedObject.id,
        });
        await finishedChapter.save();
        res.status(204);
        return;
      }
      case "step": {
        console.log(
          await FinishedSteps.findOne({ stepId: req.body.finishedObject.id })
        );
        if (
          await FinishedSteps.findOne({ stepId: req.body.finishedObject.id })
        ) {
          res.status(400).json({ message: "Step already finished" });
          return;
        }
        const finishedStep = new FinishedSteps({
          userId: req.user._id,
          stepId: req.body.finishedObject.id,
        });
        await finishedStep.save();
        res.sendStatus(204);
        return;
      }
      default: {
        res.status(400).json({ message: "Invalid Type" });
        return;
      }
    }
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
