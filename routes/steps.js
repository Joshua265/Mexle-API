const express = require("express");
const router = express.Router();
const {
  jsonParser,
  urlencodedParser,
  authenticateJWT,
} = require("../middlewares");
const {
  createStep,
  editStep,
  postVisibility,
  getVisibility,
  getStepById,
  getStepsByChapterId,
  getStepTitles,
} = require("../controller/steps");

router.post("/create", jsonParser, authenticateJWT, async (req, res) => {
  createStep(req, res);
});

router.post(
  "/edit/:stepId",
  jsonParser,
  urlencodedParser,
  authenticateJWT,
  async (req, res) => {
    editStep(req, res);
  }
);

router.post(
  "/visible/:stepId",
  jsonParser,
  urlencodedParser,
  authenticateJWT,
  async (req, res) => {
    postVisibility(req, res);
  }
);

router.get("/titles", urlencodedParser, async (req, res) =>
  getStepTitles(req, res)
);

router.get("/chapterId/:chapterId", urlencodedParser, async (req, res) => {
  getStepsByChapterId(req, res);
});

router.get("/:stepId", urlencodedParser, async (req, res) => {
  getStepById(req, res);
});

router.get(
  "/visible/:stepId",
  urlencodedParser,
  authenticateJWT,
  async (req, res) => {
    getVisibility(req, res);
  }
);

module.exports = router;
