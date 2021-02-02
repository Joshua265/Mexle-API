const express = require("express");
const router = express.Router();
const {
  jsonParser,
  urlencodedParser,
  authenticateJWT,
  parseJWT,
} = require("../middlewares");
const {
  createCourse,
  editCourse,
  postVisibility,
  getVisibility,
  getCourses,
  getCoursesByLanguage,
  getCourseInfo,
  getFilteredCourses,
  getCourseTitles,
} = require("../controller/courses");

//create course
router.post("/create", jsonParser, authenticateJWT, async (req, res) => {
  createCourse(req, res);
});

//edit course
router.post(
  "/edit/:courseId",
  jsonParser,
  urlencodedParser,
  authenticateJWT,
  async (req, res) => {
    editCourse(req, res);
  }
);

//change visibility
router.post(
  "/visible/:courseId",
  jsonParser,
  urlencodedParser,
  authenticateJWT,
  async (req, res) => {
    postVisibility(req, res);
  }
);

//get visibility
router.get(
  "/visible/:courseId",
  urlencodedParser,
  authenticateJWT,
  async (req, res) => {
    getVisibility(req, res);
  }
);

//get course Info for chapter page
router.get("/courseinfo/:courseId", urlencodedParser, async (req, res) => {
  getCourseInfo(req, res);
});

// /courses/
//get all courses
router.get("/", parseJWT, async (req, res) => {
  getCourses(req, res);
});

// /courses/filter
//get all courses with certain language
router.get("/filter", urlencodedParser, parseJWT, async (req, res) => {
  getFilteredCourses(req, res);
});

// /courses/titles
router.get("/titles/:id", urlencodedParser, async (req, res) =>
  getCourseTitles(req, res)
);

module.exports = router;
