// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors({
  credentials: true,
  origin: "https://leftistmediagroup.org"
}));

app.post('/register/email_update', function (req, res, next) {
  console.log(JSON.stringify(req));
});

app.listen(4000, function () {
  console.log('CORS-enabled web server listening on port 4000')
});