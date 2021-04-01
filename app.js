const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv/config");

// use cors
const corsOptions = {
  origin: "https://kurse.mexle.org",
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

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
  res.send("<h1>Welcome to the Mexle API Server!</h1>");
});

//listen on PORT
app.listen(parseInt(process.env.PORT || 5000), () => {
  console.log(`Server is listening on port ${process.env.PORT || 5000}...`);
});
