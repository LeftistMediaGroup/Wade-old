// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import * as express from "express";
const router = express.Router();

var PouchDB = require('pouchdb');

router.use('/account', require('express-pouchdb')(PouchDB));

export default router;