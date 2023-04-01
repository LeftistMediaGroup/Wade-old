// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();

var PouchDB = require('pouchdb');

router.use('/account', require('express-pouchdb')(PouchDB));

export default router;