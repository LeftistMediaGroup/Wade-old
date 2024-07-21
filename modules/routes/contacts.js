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

router.put("/get_contacts", (req, res) => {
  console.log(`Username: ${req.body.username}`);
  console.log(`Session: ${JSON.stringify(req.body, null, 2)}`);

  var user_db = new PouchDB(`https://${process.env.host}/:3001/database/users`);

  user_db.info().then(function (info) {
    console.log(`\nINFO: ${JSON.stringify(info, null, 2)}`);
    user_db
      .get(`${req.body.username}`)
      .then(function (result) {
        res.json(result.contacts);
        res.end();
      })
      .catch(function (err) {
        res.json({ Error: `${JSON.stringify(err, null, 2)}` });
        res.end();
      });
  });
});

router.put("/get_users", (req, res) => {
  console.log(`Username: ${req.body.username}`);
  console.log(`Session: ${JSON.stringify(req.body, null, 2)}`);
  var user_db = new PouchDB(`https://${process.env.host}/:3001/database/users`);

  let users = {};

  user_db.info().then(function () {
    user_db
      .allDocs({
        include_docs: true,
      })
      .then((result) => {
        console.log(`RESULT: ${JSON.stringify(result.rows, null, 2)}`);

        for (let user of result.rows) {
          console.log(`Single user: ${user}`);
          console.log(`Single user Doc: ${user.doc}`);
          users[user.doc.username] = {
            username: user.doc.username,
          };
        }
      })
      .then(() => {
        console.log(`USERS out: ${JSON.stringify(users, null, 2)}`);
        res.json(users);
        res.end();
      })
      .catch(function (err) {
        res.json({ Error: `${JSON.stringify(err, null, 2)}` });
        res.end();
      });
  });
});

router.put("/addContact", (req, res) => {
  console.log(`Username: ${req.body.username}`);

  var user_db = new PouchDB(`https://${process.env.host}/:3001/database/users`);

  user_db.info().then(function () {
    user_db
      .get(`${req.body.username}`)
      .then((result) => {
        try {
          result.contacts[req.body.contact] = {
            username: req.body.contact,
          };

          user_db
            .info()
            .then(() => {
              user_db.put(result);
            })
            .then(() => {
              user_db.get(`${req.body.contact}`).then((result2) => {
                result2.contacts[req.body.username] = {
                  username: req.body.username,
                };

                user_db.put(result2);
              });
            })
            .then(() => {
              res.json({ status: "Worked" });

              res.end();
            })
            .catch(function (err) {
              res.json({ Error: `${JSON.stringify(err, null, 2)}` });
              res.end();
            });
        } catch (err) {
          console.log(`Error ${err}`);
        }
      })
      .catch(function (err) {
        res.json({ Error: `${JSON.stringify(err, null, 2)}` });
        res.end();
      });
  });
});

export default router;
