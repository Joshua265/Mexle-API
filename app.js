const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

require("dotenv/config");

//localhost:3001
app.listen(3001, () => {
  console.log("Server is listening on port 3001...");
});

// allow cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//better logging
app.use(morgan("short"));

//connect to db
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to DB");
  }
);

//import routes
const userRoute = require("./routes/user/user");
const coursesRoute = require("./routes/courses/courses");
const chaptersRoute = require("./routes/chapters/chapters");

//use routes
app.use("/user", userRoute);
app.use("/courses", coursesRoute);
app.use("/chapters", chaptersRoute);

//home route
app.get("/", (req, res) => {
  console.log("Responding to root route");
  res.send("<h1>Welcome to the Mexle API Server!</h1><br/>");
});
