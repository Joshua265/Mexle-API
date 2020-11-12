const express = require("express");
const router = express.Router();
const fs = require("fs");
const { jsonParser, urlencodedParser } = require("../../middlewares");
const Image = require("../../models/image");

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var response = {};

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], "base64");

  return response;
}

// /images
router.get("/:url", urlencodedParser, async (req, res) => {
  try {
    let image = await Image.findOne({
      _id: req.params.url,
    });
    return res.status(200).sendFile(image.path, { root: "." });
    // fs.readFile(image.path, { encoding: "base64" }, function (err, imageData) {
    //   if (err) throw err;
    //   console.log("loaded");

    // });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "some error occured" });
  }
});
// /images/upload
router.post("/upload", jsonParser, async (req, res) => {
  try {
    //create filename
    // var imageTypeRegularExpression = /\/(.*?)$/;
    const imageBuffer = decodeBase64Image(req.body.imageBinary);
    // const imageTypeDetected = imageBuffer.type;
    // console.log(imageTypeDetected);
    path = `public/images/${Date.now()}-${Math.random() * 1000}.jpg`;
    //write binary to file
    fs.writeFile(path, imageBuffer.data, function (err) {
      if (err) throw err;
      console.log("Saved!");
    });
    const image = new Image({
      path: path,
    });
    await image.save();
    return res.status(200).json({
      status: true,
      response: { url: `http://localhost:3001/images/${image._id}` },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error, status: true });
  }
});

module.exports = router;
