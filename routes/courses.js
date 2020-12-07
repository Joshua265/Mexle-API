const express = require("express");
const router = express.Router();
const {
  jsonParser,
  urlencodedParser,
  authenticateJWT,
} = require("../middlewares");
const {
  createCourse,
  editCourse,
  postVisibility,
  getVisibility,
  getCourses,
  getCoursesByLanguage,
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

// /courses/
//get all with language courses
router.get("/", authenticateJWT, async (req, res) => {
  getCourses(req, res);
});

// /courses/:language
//get all with language courses
router.get("/:language", authenticateJWT, async (req, res) => {
  getCoursesByLanguage(req, res);
});

module.exports = router;
