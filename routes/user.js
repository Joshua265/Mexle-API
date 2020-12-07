const express = require("express");
const router = express.Router();
const { jsonParser, authenticateJWT } = require("../middlewares");
const { signUp, login, addFinished, autoLogin } = require("../controller/user");

// /user/login
router.post("/login", jsonParser, async (req, res) => login(req, res));

// /user/signup
// creates user
router.post("/signup", jsonParser, async (req, res) => signUp(req, res));

// /user/addfinished
// adds finished item to user
router.post("/addfinished", jsonParser, authenticateJWT, async (req, res) =>
  addFinished(req, res)
);

// /user/verifytoken
// verify token and login user automatically
router.post("/verifytoken", jsonParser, authenticateJWT, async (req, res) =>
  autoLogin(req, res)
);

module.exports = router;
