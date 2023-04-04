// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

var PouchDB = require("pouchdb");

require('dotenv').config();

setTimeout(() => {
    try {
        var account_db = new PouchDB(
            `https://${process.env.backend}:4000/database/account`
        ).catch( function (err) { 
            console.log(`Error: ${JSON.stringify(err, null, 2)}`);
        });

        account_db.info().then(function () {
            account_db.get('User_Accounts').catch(function (err) {
                if (err.name === 'not_found') {
                    let doc = {
                        "_id": 'User_Accounts',
                        "users": {}
                    };
            
                    console.log(`Setting Account file: ${JSON.stringify(doc, null, 2)}`);
                    account_db.put(doc);
                } 
            }).then(function (accounts) {
                console.log(`Returned Account File: ${JSON.stringify(accounts)}`)
            });
        });
    } catch (err) {
        console.log(`Error: ${JSON.stringify(err, null, 2)}`);
    };
}, 4000);