// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import express from 'express';
const router = express.Router();

var PouchDB = require('pouchdb');

const { v4: uuid_v4 } = require('uuid');


var account_db = new PouchDB('https://Back.LeftistMediaGroup.org/database/account');

account_db.info().then(function (info) {
    console.log(info);
})

router.post('/submit', function (req, res) {
    let data = req.body;

    data["_id"] = uuid_v4();

    console.log(`Data: ${JSON.stringify(data, null, 2)}`);

    account_db.put(data, function callback(err, result) {
        if (!err) {
          console.log(`Result: ${result}`);
        }
    });

    account_db.allDocs({
        include_docs: true,
        attachments: true
      }).then(function (result) {
        console.log(`Result: ${JSON.stringify(result, null, 2)}`);
      }).catch(function (err) {
        console.log(err);
      });
});

export default router;