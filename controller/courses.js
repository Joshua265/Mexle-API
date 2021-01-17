const Course = require("../models/Course");

const createCourse = async (req, res) => {
  try {
    if (!(req.user.role === "admin" || req.user.role === "creator")) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
    const course = new Course({
      title: req.body.title,
      description: req.body.description,
      author: req.user.username,
      language: req.body.language,
      license: req.body.license,
      visible: req.body.visible,
      picture: req.body.picture || null,
    });

    await course.save();
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const editCourse = async (req, res) => {
  try {
    //check if author matches user
    const filter = { _id: req.params.courseId };
    const course = await Course.findOne(filter);
    if (req.user.role !== "admin") {
      if (course.author !== req.user.username) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }
    }
    //update entry
    const update = {
      title: req.body.title,
      description: req.body.description,
      visible: req.body.visible,
      language: req.body.language,
      license: req.body.license,
      picture: req.body.picture,
    };
    await Course.findOneAndUpdate(filter, update);

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const postVisibility = async (req, res) => {
  try {
    //check if user has permissions
    const filter = { _id: req.params.courseId };
    const course = await Course.findOne(filter);
    if (req.user.role !== "admin") {
      if (course.author !== req.user.username) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }
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
};

const getCourseInfo = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId });
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getVisibility = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId });
    res.status(200).json(course.visible);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getCoursesByLanguage = async (req, res) => {
  try {
    let courses;
    if (req.user && req.user.role === "admin") {
      courses = await Course.findAll({ language: req.params.language });
    } else {
      courses = await Course.findAll({
        language: req.params.language,
        visible: true,
      });
    }
    res.status(200).json({ courses });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getCourses = async (req, res) => {
  try {
    let courses;
    //if logged in
    if (req.user) {
      if (req.user.role === "admin") {
        courses = await Course.find({});
      } else {
        courses = await Course.find({
          $or: [{ visible: true }, { author: req.user.username }],
        });
      }
    } //if not logged in
    else {
      courses = await Course.find({ visible: true });
    }

    res.status(200).json({ courses });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = {
  createCourse,
  editCourse,
  postVisibility,
  getVisibility,
  getCourses,
  getCoursesByLanguage,
  getCourseInfo,
};
