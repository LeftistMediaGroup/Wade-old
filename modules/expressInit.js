// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import express from 'express';
const router = express.Router()

var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');

import register from './routes/register.js';
import database from './routes/database.js';


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors({
  credentials: true,
  origin: "*"
}));

app.use('/register', register);
app.use('/database', database);

app.listen(4000, function () {
  console.log('CORS-enabled web server listening on port 4000')
});