var bodyParser = require("body-parser");
var cors = require("cors");
const express = require("express");
const app = express();

app.use(cors());
// Parses the body for POST, PUT, DELETE, etc.
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", function (req, res, next) {
  console.log(req.body.screenshot); // req.body contains the parsed body of the request.
});

app.listen(9000, function () {
  console.log("Example app listening on port 9000!");
});
