// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import express from 'express';
const router = express.Router();

var PouchDB = require('pouchdb');

const { v4: uuid_v4 } = require('uuid');


var account_db = new PouchDB('http://Back.LeftistMediaGroup.org/database/account/');

router.post('/submit', function (req, res) {
    let data = req.body;

    data["_id"] = uuid_v4();

    console.log(`Data: ${data}`);

    account_db.put(data);

    account_db.allDocs({include_docs: true, descending: true}, function(err, doc) {
        console.log(`Data In Database: ${JSON.stringify(doc.rows)}`);
    });
});

export default router;