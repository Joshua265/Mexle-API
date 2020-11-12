const express = require("express");
const router = express.Router();
const { jsonParser, urlencodedParser } = require("../../middlewares");
const Step = require("../../models/Step");

router.post("/create", jsonParser, async (req, res) => {
  try {
    const step = new Step({
      title: req.body.title,
      description: req.body.description,
      chapterId: req.body.chapterId,
      metadata: req.body.metadata,
    });

    await step.save();
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/:chapterId", urlencodedParser, async (req, res) => {
  try {
    const steps = await Step.find({ chapterId: req.params.chapterId });
    res.status(200).json({ steps });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
