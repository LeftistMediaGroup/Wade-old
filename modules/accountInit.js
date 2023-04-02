// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

var PouchDB = require("pouchdb");

var account_db = new PouchDB(
  "https://Back.LeftistMediaGroup.org/database/account"
);

account_db.info();

account_db.get('User_Accounts', {attachments: true}).catch(function (err) {
    if (err.name === 'not_found') {
        let doc = {
            "_id": "User_Accounts",
            "users": {},
            "test": "test"
        };

        console.log(`Setting Account file: ${JSON.stringify(doc, null, 2)}`);
        account_db.put(doc);
    } 
}).then(function (accounts) {
    console.log(`Returned Account File: ${JSON.stringify(accounts.test)}`);
});

