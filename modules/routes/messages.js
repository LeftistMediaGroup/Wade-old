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

router.put("/get_messages", (req, res) => {
  console.log(`Username: ${req.body.username}`);
  console.log(`Session: ${JSON.stringify(req.body, null, 2)}`)

  var user_db = new PouchDB(`http://localhost:3001/database/users`);

  user_db.info().then(function () {
    user_db
      .get(`${req.body.username}`)
      .then(function (result) {
        res.json(result.messages);
        res.end();
      })
      .catch(function (err) {
        res.json({ Error: `${JSON.stringify(err, null, 2)}` });
        res.end();
      });
  });
});

export default router;
