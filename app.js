const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv/config");

//localhost:PORT
app.listen(parseInt(process.env.PORT), () => {
  console.log(`Server is listening on port ${process.env.PORT}...`);
});

// use cors
app.use(cors());
app.options("*", cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//better logging
app.use(morgan("dev"));

//connect to db
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to DB");
  }
);

//import routes
const userRoute = require("./routes/user");
const coursesRoute = require("./routes/courses");
const chaptersRoute = require("./routes/chapters");
const stepsRoute = require("./routes/steps");
const imagesRoute = require("./routes/images");

//use routes
app.use("/user", userRoute);
app.use("/courses", coursesRoute);
app.use("/chapters", chaptersRoute);
app.use("/steps", stepsRoute);
app.use("/images", imagesRoute);

//home route
app.get("/", (req, res) => {
  console.log("Responding to root route");
  res.send("<h1>Welcome to the Mexle API Server!</h1><br/>");
});
