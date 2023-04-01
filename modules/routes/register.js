// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import express from "express";
const router = express.Router();

var PouchDB = require("pouchdb");

const { v4: uuid_v4 } = require("uuid");

var account_db = new PouchDB(
  "https://Back.LeftistMediaGroup.org/database/account"
);

account_db.info().then(function (info) {
  console.log(info);
});

router.post("/submit", function (req, res) {
  let data = req.body;

  data["_id"] = uuid_v4();

  console.log(`Data: ${JSON.stringify(data, null, 2)}`);

  account_db.put(data)
});

export default router;
