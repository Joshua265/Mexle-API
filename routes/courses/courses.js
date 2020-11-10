const express = require("express");
const router = express.Router();
const { jsonParser } = require("../../middlewares");
const Course = require("../../models/Course");

router.post("/create", jsonParser, async (req, res) => {
  console.log(req.body);
  try {
    const course = new Course({
      title: req.body.title,
      description: req.body.description,
      picture: req.body.picture || null,
    });

    await course.save();
    res.sendStatus(204);
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
