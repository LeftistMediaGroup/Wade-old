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
  var RSS_db = new PouchDB(`http://localhost:3001/database/rss`);

  RSS_db.info().then(() => {
    RSS_db.allDocs({
      include_docs: true,
    })
      .then((result) => {
        console.log(`RESULT: ${JSON.stringify(result.rows, null, 2)}`);

        res.json(result.rows);
        res.end();
      })
      .catch(function (err) {
        res.json(`{
          "Error": ${err}
          }
          `);
        res.end();
      });
  });
});

router.get("/test", (req, res) => {
  res.json({ "Response:": "Test" });
  res.end();
});

export default router;
