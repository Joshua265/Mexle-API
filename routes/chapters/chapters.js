const express = require("express");
const router = express.Router();
const { jsonParser, urlencodedParser } = require("../../middlewares");
const Chapter = require("../../models/Chapter");

router.post("/create", jsonParser, async (req, res) => {
  console.log(req.body);
  try {
    const chapter = new Chapter({
      title: req.body.title,
      description: req.body.description,
      courseId: req.body.courseId,
      picture: req.body.picture || null,
    });

    await chapter.save();
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/:courseId", urlencodedParser, async (req, res) => {
  console.log(req.params);
  try {
    const chapters = await Chapter.find({ courseId: req.params.courseId });
    res.status(200).json({ chapters });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
