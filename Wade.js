var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors());

app.post('/register/email_update', function (req, res, next) {
    console.log(req.body);
});

app.listen(4000, function () {
  console.log('CORS-enabled web server listening on port 4000')
});