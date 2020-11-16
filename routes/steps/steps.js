const express = require("express");
const router = express.Router();
const { jsonParser, urlencodedParser } = require("../../middlewares");
const Step = require("../../models/Step");

router.post("/create", jsonParser, async (req, res) => {
  try {
    const step = new Step({
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      chapterId: req.body.chapterId,
      metadata: req.body.metadata,
    });

    await step.save();
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post("/edit/:stepId", jsonParser, urlencodedParser, async (req, res) => {
  try {
    //check if author matches user
    const filter = { _id: req.params.stepId };
    const step = await Step.findOne(filter);
    if (step.author !== req.body.author) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
    //update entry
    const update = {
      title: req.body.title,
      description: req.body.description,
      chapterId: req.body.chapterId,
      metadata: req.body.metadata,
    };
    await Step.findOneAndUpdate(filter, update);

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/chapterId/:chapterId", urlencodedParser, async (req, res) => {
  try {
    const steps = await Step.find({ chapterId: req.params.chapterId });
    res.status(200).json({ steps });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/:stepId", urlencodedParser, async (req, res) => {
  try {
    const step = await Step.findOne({ _id: req.params.stepId });
    res.status(200).json(step);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
