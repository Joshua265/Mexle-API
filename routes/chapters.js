const express = require("express");
const router = express.Router();
const {
  jsonParser,
  urlencodedParser,
  authenticateJWT,
} = require("../middlewares");
const {
  createChapter,
  editChapter,
  getChapterByCourseId,
  getChapterByChapterId,
  getVisibility,
  postVisibility,
  getChapterTitles,
} = require("../controller/chapters");

router.post("/create", jsonParser, authenticateJWT, async (req, res) =>
  createChapter(req, res)
);

router.post(
  "/edit/:chapterId",
  jsonParser,
  urlencodedParser,
  authenticateJWT,
  (req, res) => editChapter(req, res)
);

router.get("/courseId/:courseId", urlencodedParser, (req, res) =>
  getChapterByCourseId(req, res)
);

router.get("/:chapterId", urlencodedParser, async (req, res) =>
  getChapterByChapterId(req, res)
);

router.get("/titles/:id", urlencodedParser, async (req, res) =>
  getChapterTitles(req, res)
);

router.get(
  "/visible/:chapterId",
  urlencodedParser,
  authenticateJWT,
  async (req, res) => getVisibility(req, res)
);

router.post(
  "/visible/:chapterId",
  urlencodedParser,
  jsonParser,
  authenticateJWT,
  async (req, res) => postVisibility(req, res)
);

module.exports = router;
