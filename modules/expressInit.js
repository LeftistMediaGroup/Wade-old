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

import {account_init} from "./modules/accountInit.js";

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors({
  credentials: true,
  origin: "https://leftistmediagroup.org"
}));

app.use('/register', register);
app.use('/database', database);
account_init.start(app);

app.listen(4000, function () {
  console.log('CORS-enabled web server listening on port 4000')
});