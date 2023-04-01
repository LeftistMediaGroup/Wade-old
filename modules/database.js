const express = require('express');
const router = express.Router();

var PouchDB = require('pouchdb');

router.use('/account', require('express-pouchdb')(PouchDB));