const express = require('express');
const router = express.Router();
const {
  jsonParser,
  authenticateJWT,
  urlencodedParser
} = require('../middlewares');
const {
  signUp,
  login,
  addFinished,
  autoLogin,
  changeAvatar,
  deleteAvatar,
  getHistory,
  getUserInfo,
  verifyUser
} = require('../controller/user');

// /user/login
router.post('/login', jsonParser, async (req, res) => login(req, res));

// /user/signup
// creates user
router.post('/signup', jsonParser, async (req, res) => signUp(req, res));

// /user/confirm
// get user history
router.get('/confirm/:confirmationCode', urlencodedParser, async (req, res) =>
  verifyUser(req, res)
);

// /user/addfinished
// adds finished item to user
router.post('/addfinished', jsonParser, authenticateJWT, async (req, res) =>
  addFinished(req, res)
);

// /user/verifytoken
// verify token and login user automatically
router.post('/verifytoken', jsonParser, authenticateJWT, async (req, res) =>
  autoLogin(req, res)
);

// /user/changeavatar
// change user avatar
router.post('/changeavatar', jsonParser, authenticateJWT, async (req, res) =>
  changeAvatar(req, res)
);

// /user/deleteavatar
// delete user avatar
router.post('/deleteavatar', jsonParser, authenticateJWT, async (req, res) =>
  deleteAvatar(req, res)
);

// /user/history
// get user history
router.get('/history', jsonParser, authenticateJWT, async (req, res) =>
  getHistory(req, res)
);

// /user/info
// get username and avatar
router.get('/info/:id', urlencodedParser, authenticateJWT, async (req, res) =>
  getUserInfo(req, res)
);

module.exports = router;
