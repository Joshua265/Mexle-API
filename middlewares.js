const bodyParser = require("body-parser");

//middlewares

// create application/json parser
const jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = { jsonParser, urlencodedParser };
