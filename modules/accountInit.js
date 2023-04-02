// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

var PouchDB = require("pouchdb");

var account_db = new PouchDB(
  "https://Back.LeftistMediaGroup.org/database/account"
);

account_db.info().then(function () {
    account_db.get('Accounts').catch(function (err) {
        if (err.name === 'not_found') {

            let data = {
                "_id": "Accounts",
                "users": {}
            };

            console.log(`Setting Account file: ${JSON.stringify(data, null, 2)}`);
            account_db.put(data);
        } 
    }).then(function (accounts) {
        console.log(`Returned Account File: ${JSON.stringify(accounts, null, 2)}`);
    });
});

