// Allow require
import { createRequire } from "module";

import express from 'express';
import  * as evs from 'express-video-stream'; // Express Video Stream


const require = createRequire(import.meta.url);


const fs = require('fs')
const path = require('path')
var PouchDB = require("pouchdb");


var router = express.Router();

router.get('/current', (req, res) => { 
    var gp_db = new PouchDB(`https://192.168.58.50/database/users`);

    users_db
    .info()
    .then(() => {
      users_db
        .get(`${req.session.username}`)
        .then((result) => {
          console.log(`Result IN: ${JSON.stringify(result, null, 2)}`);
        })
    })
});

export default router;
