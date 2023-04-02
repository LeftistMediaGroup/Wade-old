// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import express from "express";
const router = express.Router();

var PouchDB = require("pouchdb");

const { v4: uuid_v4 } = require("uuid");
const set = require('set-value');



var account_db = new PouchDB(
  "https://Back.LeftistMediaGroup.org/database/account"
);

account_db.info().then(function (info) {
  console.log(info);
});

router.post("/submit", function (req, res) {
  let user = req.body;
  
  console.log(`User in: ${JSON.stringify(user, null, 2)}`);

  user["_id"] = uuid_v4();

  console.log(`User modified: ${JSON.stringify(user, null, 2)}`);

  account_db.get("Accounts", {attachments: true}).then(function (accounts) {
    console.log(`Account file in ${JSON.stringify(accounts, null, 2)}`);

    set(accounts, `users.${user.email}`, user);

    console.log(`Accounts file out: ${JSON.stringify(accounts, null, 2)}`);
    
    account_db.put(accounts);
  });
});

export default router;