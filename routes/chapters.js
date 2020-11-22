const express = require("express");
const router = express.Router();
const { jsonParser, urlencodedParser } = require("../middlewares");
const {
  createChapter,
  editChapter,
  getCourseByCourseId,
  getCourseByChapterId,
  getVisible,
} = require("../controller/chapters");

router.post("/create", jsonParser, async (req, res) => createChapter(req, res));

router.post("/edit/:chapterId", jsonParser, urlencodedParser, (req, res) =>
  editChapter(req, res)
);

router.get("/courseId/:courseId", urlencodedParser, (req, res) =>
  getCourseByCourseId(req, res)
);

router.get("/:chapterId", urlencodedParser, async (req, res) =>
  getCourseByChapterId(req, res)
);

router.get("/visible/:chapterId", urlencodedParser, async (req, res) =>
  getVisible(req, res)
);

module.exports = router;
