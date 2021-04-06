const Chapter = require("../models/Chapter");
const Course = require("../models/Course");

const checkCreatePermission = async (user, courseId) => {
  if (user.role === "admin" || user.role === "creator") {
    return true;
  }
  const course = await Course.findOne({ _id: courseId });
  if (user.username === course.author) {
    return true;
  }
  return false;
};

const createChapter = async (req, res) => {
  try {
    if (!(await checkCreatePermission(req.user, req.body.courseId))) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
    const chapter = new Chapter({
      title: req.body.title,
      description: req.body.description,
      courseId: req.body.courseId,
      visible: req.body.visible,
      author: req.user.username,
      picture: req.body.picture || null,
    });

    await chapter.save();
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const editChapter = async (req, res) => {
  try {
    //check if author matches user
    const filter = { _id: req.params.chapterId };
    const chapter = await Chapter.findOne(filter);
    if (req.user.role !== "admin") {
      if (chapter.author !== req.user.username) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }
    }
    //update entry
    const update = {
      title: req.body.title,
      description: req.body.description,
      visible: req.body.visible,
      picture: req.body.picture,
    };
    await Chapter.updateOne(filter, update);

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getChapterByCourseId = async (req, res) => {
  try {
    const chapters = await Chapter.find({ courseId: req.params.courseId });
    res.status(200).json({ chapters });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getChapterByChapterId = async (req, res) => {
  try {
    const chapter = await Chapter.find({ _id: req.params.chapterId });
    res.status(200).json({ chapter: chapter[0] });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getVisibility = async (req, res) => {
  try {
    const chapter = await Chapter.findOne({ _id: req.params.chapterId });
    res.status(200).json(chapter.visible);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const postVisibility = async (req, res) => {
  try {
    //check if user is authorized
    const filter = { _id: req.params.chapterId };
    const chapter = await Chapter.findOne(filter);
    if (req.user.role !== "admin") {
      if (chapter.author !== req.user._id) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }
    }
    //update entry
    console.log(req.body.visible);
    const update = {
      $set: { visible: req.body.visible },
    };
    await Chapter.updateOne(filter, update);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getChapterTitles = async (req, res) => {
  try {
    const chapterTitle = await Chapter.findOne({
      _id: req.params.id,
    }).select("title -_id");
    res.status(200).json(chapterTitle.title);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = {
  createChapter,
  editChapter,
  getChapterByCourseId,
  getChapterByChapterId,
  getVisibility,
  postVisibility,
  getChapterTitles,
};
