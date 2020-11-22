const express = require("express");
const router = express.Router();
const { jsonParser, urlencodedParser } = require("../middlewares");
const Course = require("../models/Course");

router.post("/create", jsonParser, async (req, res) => {
  console.log(req.body);
  try {
    const course = new Course({
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      visible: req.body.visible,
      picture: req.body.picture || null,
    });

    await course.save();
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post(
  "/edit/:courseId",
  jsonParser,
  urlencodedParser,
  async (req, res) => {
    try {
      //check if author matches user
      const filter = { _id: req.params.courseId };
      const course = await Course.findOne(filter);
      if (course.author !== req.body.author) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }
      //update entry
      const update = {
        title: req.body.title,
        description: req.body.description,
        visible: req.body.visible,
        picture: req.body.picture,
      };
      await Course.findOneAndUpdate(filter, update);

      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

router.post(
  "/visible/:courseId",
  jsonParser,
  urlencodedParser,
  async (req, res) => {
    try {
      //check if author matches user
      const filter = { _id: req.params.courseId };
      const course = await Course.findOne(filter);
      if (course.author !== req.body.user) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }
      //update entry
      const update = {
        visible: req.body.visible,
      };
      await Course.findOneAndUpdate(filter, update);

      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

router.get("/visible/:courseId", urlencodedParser, async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId });
    res.status(200).json(course.visible);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({ courses });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
