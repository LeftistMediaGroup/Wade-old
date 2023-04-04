// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);


import express from "express";
const router = express.Router();

var PouchDB = require("pouchdb");

const { v4: uuid_v4 } = require("uuid");
const set = require('set-value');

require('dotenv').config()

setTimeout(() => {
  var account_db = new PouchDB(
    `https://${process.env.backend}:4000/database/account`
  );

  account_db.info()

  router.post("/submit", function (req, res) {
    let user = req.body;
    
    console.log(`User in: ${JSON.stringify(user, null, 2)}`);

    user["_id"] = uuid_v4();

    console.log(`User modified: ${JSON.stringify(user, null, 2)}`);

    account_db.get('User_Accounts').then(function (accounts) {
      console.log(`Account file in ${JSON.stringify(accounts, null, 2)}`);

      set(accounts, `users.${user.email}`, user);

      console.log(`Accounts file out: ${JSON.stringify(accounts, null, 2)}`);
      
      account_db.put(accounts);
    }).catch(function (err) {
      console.log(`Error: ${JSON.stringify(err, null, 2)}`);
    })  ;
  });
}, 4000);



export default router;
