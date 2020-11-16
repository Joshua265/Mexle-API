const express = require("express");
const router = express.Router();
const { jsonParser, urlencodedParser } = require("../../middlewares");
const Chapter = require("../../models/Chapter");

router.post("/create", jsonParser, async (req, res) => {
  try {
    const chapter = new Chapter({
      title: req.body.title,
      description: req.body.description,
      courseId: req.body.courseId,
      author: req.body.author,
      picture: req.body.picture || null,
    });

    await chapter.save();
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post(
  "/edit/:chapterId",
  jsonParser,
  urlencodedParser,
  async (req, res) => {
    try {
      //check if author matches user
      const filter = { _id: req.params.chapterId };
      const chapter = await Chapter.findOne(filter);
      if (chapter.author !== req.body.author) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }
      //update entry
      const update = {
        title: req.body.title,
        description: req.body.description,
        picture: req.body.picture,
      };
      await Chapter.findOneAndUpdate(filter, update);

      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

router.get("/courseId/:courseId", urlencodedParser, async (req, res) => {
  try {
    const chapters = await Chapter.find({ courseId: req.params.courseId });
    res.status(200).json({ chapters });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/:chapterId", urlencodedParser, async (req, res) => {
  try {
    const chapter = await Chapter.find({ _id: req.params.chapterId });
    res.status(200).json({ chapter: chapter[0] });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
