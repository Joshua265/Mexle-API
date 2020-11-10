const jwt = require("jsonwebtoken");

// Verify Token
function verifyToken(req, res) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader === "undefined") {
    // Forbidden
    res.sendStatus(403);
    return false;
  }

  // Split at the space
  const bearer = bearerHeader.split(" ");
  // Get token from array
  const bearerToken = bearer[1];
  // Set the token
  req.token = bearerToken;
  //verify token
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
      return false;
    }
    //token accepted
    return true;
  });
}

module.exports = verifyToken;
