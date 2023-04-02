// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

var PouchDB = require("pouchdb");

var account_db = new PouchDB(
  "https://Back.LeftistMediaGroup.org/database/account"
);

account_db.info().then(function () {
    account_db.get('Accounts', {attachments: true}).catch(function (err) {
        if (err.name === 'not_found') {

            let doc = {
                "_id": "Accounts",
                "users": {}
            };

            console.log(`Setting Account file: ${JSON.stringify(doc, null, 2)}`);
            account_db.put(doc);
        } 
    }).then(function (accounts) {
        console.log(`Returned Account File: ${JSON.stringify(accounts, null, 2)}`);
    });
});

