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
      author: req.user._id,
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
    await Course.updateOne(filter, update);

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
      if (course.author !== req.user._id) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }
    }

    //update entry
    const update = {
      $set: { visible: req.body.visible || !course.visible },
    };
    await Course.updateOne(filter, update);

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
      courses = await Course.find({ language: req.params.language });
    } else {
      courses = await Course.find({
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
          $or: [{ visible: true }, { author: req.user._id }],
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

const getFilteredCourses = async (req, res) => {
  try {
    let filter = {
      language: req.query.language,
      title: { $regex: `.*${req.query.search}.*` },
      visible: true,
    };

    //show invisible for certain users
    if (req.user) {
      if (req.user.role === "admin") {
        filter = {
          language: req.query.language,
          title: { $regex: `.*${req.query.search}.*` },
        };
      } else {
        filter = {
          $or: [
            {
              language: req.query.language,
              title: { $regex: `.*${req.query.search}.*` },
              visible: true,
            },
            {
              language: req.query.language,
              title: { $regex: `.*${req.query.search}.*` },
              author: req.user.id,
            },
          ],
        };
      }
    }

    //language all exception
    if (req.query.language === "all") {
      filter = { ...filter, language: { $regex: `.*.*` } };
    }

    const courses = await Course.find(filter);

    res.status(200).json({ courses });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getCourseTitles = async (req, res) => {
  try {
    const courseTitle = await Course.findOne({
      _id: req.params.id,
    }).select("title -_id");
    res.status(200).json(courseTitle.title);
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
  getCourseTitles,
  getFilteredCourses,
};
