const Chapter = require("../models/Chapter");
const Step = require("../models/Step");

const checkCreatePermission = async (user, chapterId) => {
  if (user.role === "admin" || user.role === "creator") {
    return true;
  }
  const chapter = await Chapter.findOne({ _id: chapterId });
  if (user.username === chapter.author) {
    return true;
  }
  return false;
};

const createStep = async (req, res) => {
  try {
    if (!checkCreatePermission(req.user, req.body.chapterId)) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
    const step = new Step({
      title: req.body.title,
      description: req.body.description,
      author: req.user.username,
      visible: req.body.visible,
      chapterId: req.body.chapterId,
      content: req.body.content,
    });

    await step.save();
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const editStep = async (req, res) => {
  try {
    //check if user is authorized
    const filter = { _id: req.params.stepId };
    const step = await Step.findOne(filter);
    if (req.user.role !== "admin") {
      if (step.author !== req.body.author) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }
    }
    //update entry
    const update = {
      title: req.body.title,
      description: req.body.description,
      visible: req.body.visible,
      chapterId: req.body.chapterId,
      content: req.body.content,
    };
    await Step.findOneAndUpdate(filter, update);

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const postVisibility = async (req, res) => {
  try {
    //check if user is authorized
    const filter = { _id: req.params.stepId };
    const step = await Step.findOne(filter);
    if (req.user.role !== "admin") {
      if (step.author !== req.body.user) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }
    }
    //update entry
    const update = {
      visible: req.body.visible,
    };
    await Step.findOneAndUpdate(filter, update);

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getStepsByChapterId = async (req, res) => {
  try {
    const steps = await Step.find({ chapterId: req.params.chapterId });
    res.status(200).json({ steps });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getStepById = async (req, res) => {
  try {
    const step = await Step.findOne({ _id: req.params.stepId });
    res.status(200).json(step);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getVisibility = async (req, res) => {
  try {
    const step = await Step.findOne({ _id: req.params.stepId });
    res.status(200).json(step.visible);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = {
  createStep,
  editStep,
  getStepsByChapterId,
  postVisibility,
  getVisibility,
  getStepById,
};
