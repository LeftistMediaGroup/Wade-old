// Allow require
import { createRequire } from "module";

import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";

//End require
const require = createRequire(import.meta.url);
var PouchDB = require("pouchdb");

var express = require("express");
var router = express.Router();

var strftime = require("strftime");

dotenv.config();

router.get("/get_rss", (req, res) => {
  var RSS_db = new PouchDB(
    `https://${process.env.host}:${process.env.port}/database/rss`
  );

  RSS_db.info().then(function () {
    RSS_db.allDocs({
      include_docs: true,
      attachments: true,
    })
      .then(function (result) {
        res.json(result);
        res.end();
      })
      .catch(function (err) {
        res.json(err);
        res.end();
      });
  });
});

export default router;
