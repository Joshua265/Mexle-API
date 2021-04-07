const User = require('../models/User');
const FinishedChapters = require('../models/FinishedChapters');
const FinishedSteps = require('../models/FinishedSteps');
const FinishedCourses = require('../models/FinishedCourses');
const jwt = require('jsonwebtoken');
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Step = require('../models/Step');
const { sendConfirmationEmail } = require('../config/nodemailer');

require('dotenv/config');

const createLoginData = async (res, userData) => {
  if (userData.length === 0) {
    res.status(400).json({ message: 'Wrong Username or Password!' });
    return;
  }
  if (userData.status != 'Active') {
    return res.status(401).json({
      message: 'Pending Account. Please Verify Your Email!'
    });
  }
  const finishedCourses = await FinishedCourses.find({
    userId: userData._id
  });

  const finishedChapters = await FinishedChapters.find({
    userId: userData._id
  });

  const finishedSteps = await FinishedSteps.find({
    userId: userData._id
  });

  const token = jwt.sign(
    { _id: userData._id, username: userData.username, role: userData.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '4h' }
  );

  return {
    token,
    userData: {
      username: userData.username,
      role: userData.role,
      email: userData.email,
      avatar: userData.avatar,
      coins: userData.coins,
      hhnAccount: userData.hhnAccount,
      language: userData.language,
      finishedCourses: finishedCourses,
      finishedChapters: finishedChapters,
      finishedSteps: finishedSteps
    }
  };
};

const login = async (req, res) => {
  try {
    const user = {
      username: req.body.username,
      password: req.body.password
    };
    const userData = await User.findOne(user);
    const responseData = await createLoginData(res, userData);
    res.status(200).json(responseData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

const autoLogin = async (req, res) => {
  try {
    const userData = await User.findOne({
      username: req.user.username,
      _id: req.user._id
    });
    const responseData = await createLoginData(res, userData);
    res.status(200).json(responseData);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const signUp = async (req, res) => {
  try {
    //check if user already exists
    users = await User.find({ username: req.body.username });
    if (users.length > 0) {
      res
        .status(400)
        .json({ message: 'User with that username already exists!' });
      return;
    }

    const validationToken = jwt.sign(
      { email: req.body.email },
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = new User({
      username: req.body.username,
      email: req.body.email || '',
      password: req.body.password,
      confirmationCode: validationToken
    });

    await sendConfirmationEmail(
      req.body.username,
      req.body.email,
      validationToken
    );

    await user.save();
    res.status(200).json({
      message: 'User was registered successfully! Please check your email'
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

const verifyUser = async (req, res) => {
  try {
    user = await User.findOne({
      confirmationCode: req.params.confirmationCode
    });
    if (!user) {
      return res.status(404).send({ message: 'User Not found.' });
    }

    user.status = 'Active';
    await user.save();
    res.status(200).json({ message: 'E-Mail confirmed successfully!' });
  } catch (err) {
    res.status(500).json({ message: err });
    console.log('error', err);
  }
};

const addFinished = async (req, res) => {
  try {
    switch (req.body.type) {
      case 'course': {
        if (
          await FinishedCourses.findOne({
            courseId: req.body.finishedObject.id
          })
        ) {
          res.sendStatus(400).json({ message: 'Course already finished' });
          return;
        }
        const finishedCourse = new FinishedCourses({
          userId: req.user._id,
          courseId: req.body.finishedObject.id
        });
        await finishedCourse.save();
        res.status(200).json({ obj: finishedCourse });
        return;
      }
      case 'chapter': {
        if (
          await FinishedChapters.findOne({
            chapterId: req.body.finishedObject.id
          })
        ) {
          res.status(400).json({ message: 'Chapter already finished' });
          return;
        }
        const finishedChapter = new FinishedChapters({
          userId: req.user._id,
          chapterId: req.body.finishedObject.id
        });
        await finishedChapter.save();
        res.status(200).json({ obj: finishedChapter });
        return;
      }
      case 'step': {
        if (
          await FinishedSteps.findOne({ stepId: req.body.finishedObject.id })
        ) {
          res.status(400).json({ message: 'Step already finished' });
          return;
        }
        const finishedStep = new FinishedSteps({
          userId: req.user._id,
          stepId: req.body.finishedObject.id
        });
        await finishedStep.save();
        res.status(200).json({ obj: finishedStep });
        return;
      }
      default: {
        res.status(400).json({ message: 'Invalid Type' });
        return;
      }
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const changeAvatar = async (req, res) => {
  try {
    //change path to avatar
    filter = { _id: req.user._id };
    update = { $set: { avatar: req.body.avatar } };
    await User.updateOne(filter, update);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

const deleteAvatar = async (req, res) => {
  try {
    //delete path to avatar
    filter = { _id: req.user._id };
    update = { $set: { avatar: null } };
    await User.update(filter, update);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getUserInfo = async (req, res) => {
  try {
    filter = { _id: req.body.id };

    const user = await (await User.findOne(filter)).isSelected(
      'username avatar -_id'
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getHistory = async (req, res) => {
  try {
    const finishedCourses = await FinishedCourses.find({
      userId: req.user._id
    });

    const finishedChapters = await FinishedChapters.find({
      userId: req.user._id
    });

    const finishedSteps = await FinishedSteps.find({
      userId: req.user._id
    });

    let data = [];

    await Promise.all(
      finishedCourses.map(async (item) => {
        let name = '';
        try {
          name = await Course.findOne({ _id: item.courseId });
          name = name.title;
        } catch (err) {
          name = 'Unknown';
        }
        data.push({ time: item.createdAt, type: 'course', name: name });
      })
    );

    await Promise.all(
      finishedChapters.map(async (item) => {
        let name = '';
        try {
          name = await Chapter.findOne({ _id: item.chapterId });
          name = name.title;
        } catch (err) {
          name = 'Unknown';
        }
        data.push({ time: item.createdAt, type: 'chapter', name: name });
      })
    );

    await Promise.all(
      finishedSteps.map(async (item) => {
        let name = '';
        try {
          name = await Step.findOne({ _id: item.stepId });
          name = name.title;
        } catch (err) {
          name = 'Unknown';
        }
        data.push({ time: item.createdAt, type: 'step', name: name });
      })
    );

    // const sortedData = data.sort((a, b) => b.time - a.time);
    res.status(200).json({ history: data.reverse() });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = {
  login,
  signUp,
  addFinished,
  autoLogin,
  changeAvatar,
  deleteAvatar,
  getHistory,
  getUserInfo,
  verifyUser
};
