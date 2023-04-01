import * as express from "express";
const router = express.Router();

var PouchDB = require('pouchdb');


var account_db = new PouchDB('http://localhost:3000/account');

router.post('/register/submit', function (req, res) {
    data = req.body;

    console.log(`Data: ${data}`);

    account_db.put(data);

    db.allDocs({include_docs: true, descending: true}, function(err, doc) {
        console.log(`Data In Database: ${JSON.stringify(doc.rows)}`);
    });
});

export default router;