// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import express from 'express';
const router = express.Router();

var PouchDB = require('pouchdb');

import { uuid } from 'uuidv4';


var account_db = new PouchDB('http://localhost:3000/account');

router.post('/submit', function (req, res) {
    let data = req.body;

    data["_id"] = uuid();

    console.log(`Data: ${data}`);

    account_db.put(data);

    account_db.allDocs({include_docs: true, descending: true}, function(err, doc) {
        console.log(`Data In Database: ${JSON.stringify(doc.rows)}`);
    });
});

export default router;