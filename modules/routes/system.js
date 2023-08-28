// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

var PouchDB = require("pouchdb");

var express = require("express");
var router = express.Router();

import * as dotenv from "dotenv";

dotenv.config();

var data_db = new PouchDB(
  `https:/  </body>

  </html>/${process.env.host}:${process.env.port}/database/data`
);

router.post("/register_admin", (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;

    let data = {
      username: username,
      password: password,
    };

    console.log(`Data: ${JSON.stringify(data, null, 2)}`);

    data_db.info().then(function (info) {
      console.log(`Info: ${JSON.stringify(info)}`);

      data_db
        .get("Main")
        .then(function (result) {
          console.log(`Main: ${JSON.stringify(result, null, 2)}`);

          if (!JSON.stringify(result).includes(username)) {
            console.log(`Adding data: ${JSON.stringify(data, null, 2)}`);

            result.users[username] = data;

            data_db
              .put(result)
              .then(function (result2) {
                console.log(`Result2: ${JSON.stringify(result2, null, 2)}`);

                req.session.username = username;

                req.session.save();
                res.send("Success");
                res.end();
              })
              .catch(function (err) {
                console.log(`Error: ${err}`);
              });
          } else {
            console.log(
              `Found data: ${JSON.stringify(
                username,
                null,
                2
              )} in database, not adding`
            );

            res.json("Username Taken");
            res.end();
          }
        })
        .catch(function (err) {
          console.log(`Error: ${err}`);
        });
    });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

router.get("/is_loggedin", (req, res) => {
  try {
    if (req.session.username !== undefined) {
      res.json({
        username: req.session.username,
      });
      res.end();
    } else {
      res.json({
        username: "Not logged in",
      });
      res.end();
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

router.post("/login_admin", (req, res) => {
  setTimeout(Login_Admin(req, res), 3000);
});

function Login_Admin(req, res) {
  try {
    console.log(`Session in: ${JSON.stringify(req.session)}`);

    let username = req.body.username;

    let password = req.body.password;

    data_db.info().then(function (info) {
      data_db
        .get("Main")
        .then(function (result) {
          console.log(`Main: `);

          if (!JSON.stringify(result).includes(username)) {
            console.log(`Username ${username} not found`);
          } else {
            console.log(
              `Username found: ${JSON.stringify(
                { username: username },
                null,
                2
              )}`
            );

            if (!req.session.username) {
              req.session.username = req.body.username;
              console.log(`Username Set: ${req.session.username}`);
            }

            console.log(
              `USERNAME out: ${JSON.stringify(req.session.username)}`
            );
          }
        })
        .catch(function (err) {
          console.log(`Error: ${err}`);
        });
    });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
}

router.post("/login_back", (req, res) => {
  let data = {
    username: req.body.back1_username,
    password: req.body.back1_password,
  };

  console.log(`\n${data.username} attempting auth\n`);

  data_db.get("Main").then(function (main) {
    let auth = main.back_auth;

    let back_num = 0;
    let result;

    auth.forEach((back) => {
      if (back.back1_username === data.username) {
        if (back.back1_password === data.password) {
          result = true;
        }
      } else {
        back_num++;
      }
    });

    if (result === true) {
      if (!req.session.username) {
        req.session.username = data.username;
        console.log(`\nUsername Set: ${req.session.username}`);

        res.json(`Username Set: ${req.session.username}`);
        res.end();
      } else {
        res.send(`Already logged in as ${req.session.username}`);
        res.end();
      }

      console.log(`\n${data.username} logged in\n`);
    } else {
      console.log(`Rejected`);
      res.json("Auth rejected, check creds");
      res.end();
    }
  });
});

export default router;
