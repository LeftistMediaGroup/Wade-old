// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

var Chance = require("chance");
var chance = new Chance();

var PouchDB = require("pouchdb");

var express = require("express");
var router = express.Router();

import * as dotenv from "dotenv";
import strftime from "strftime";
import Send_Mail from "../email.js";

dotenv.config();

router.put("/register_user", (req, res) => {
  try {
    let password = req.body.password;
    let email = req.body.email;

    let first = chance.first();
    let last = chance.last();

    let username = `${first}-${last}-${chance.integer({ min: 1, max: 99 })}`;

    let data = {
      username: username,
      password: password,
      email: email,
      registerTime: strftime("%Y%M%D_%X"),
      avatar: chance.avatar(),
      messages: {},
      taks: {},
      files: {},
      is_admin: false,
    };

    console.log(`Data: ${JSON.stringify(data, null, 2)}`);

    var main_db = new PouchDB(
      `http://${process.env.host}:${process.env.port}/database/data`
    );

    main_db.info().then(function (info) {
      main_db
        .get("Main")
        .then(function (result) {
          if (!JSON.stringify(result).includes(email)) {
            result.users[username] = data;

            main_db
              .put(result)
              .then(function (result2) {
                try {
                  req.session.username = JSON.stringify(
                    `${data.alias.first}-${data.alias.last}`
                  );

                  res.setHeader("Content-Type", "text/html");

                  console.log(
                    `Session saved: \nSession: ${JSON.stringify(
                      req.session,
                      null,
                      2
                    )}\nSession Username: ${req.session.username}`
                  );
                } catch (err) {
                  console.log(`Session Add Error: ${err}`);
                }

                res.json({ username: username, is_loggedin: true });
                res.end();

                //Send emails
                //new Send_Mail(data);
              })
              .catch(function (err) {
                console.log(`Error: ${err}`);
              });
          } else {
            res.json("Username Taken");
            res.end();
          }
        })
        .catch(function (err) {
          console.log(`Error: ${JSON.stringify(err, null, 2)}`);
        });
    });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

router.get("/is_loggedin", (req, res) => {
  console.log(`Username: ${req.session.username}`);

  console.log(`Session: ${JSON.stringify(req.session, null, 2)}`);
  console.log(`Session cookie: ${JSON.stringify(req.session.cookie, null, 2)}`);
  console.log(
    `Session username: ${JSON.stringify(req.session.username, null, 2)}`
  );

  if (req.session.username !== undefined) {
    res.json({
      username: req.session.username,
    });
  } else {
    res.json({
      username: "Not logged in",
    });
  }

  res.end();
});

router.put("/register_admin", (req, res) => {
  try {
    let password = req.body.password;
    let email = req.body.email;

    let first = chance.first();
    let last = chance.last();

    let username = `${first}-${last}-${chance.integer({ min: 1, max: 99 })}`;

    let data = {
      username: username,
      password: password,
      email: email,
      registerTime: strftime("%Y%M%D_%X"),
      avatar: chance.avatar(),
      messages: {},
      tasks: {},
      files: {},
      is_admin: true,
    };

    console.log(`Data: ${JSON.stringify(data, null, 2)}`);

    var main_db = new PouchDB(
      `http://${process.env.host}:${process.env.port}/database/data`
    );

    main_db.info().then(function (info) {
      console.log(`Info: ${JSON.stringify(info)}`);

      main_db
        .get("Main")
        .then(function (result) {
          console.log(`Main: ${JSON.stringify(result, null, 2)}`);
          if ((result.root_created = false)) {
            if (!JSON.stringify(result).includes(email)) {
              console.log(`Adding data: ${JSON.stringify(data, null, 2)}`);

              result.users[username] = data;
              result.root_created = true;

              main_db
                .put(result)
                .then(function (result2) {
                  console.log(`Result2: ${JSON.stringify(result2, null, 2)}`);

                  try {
                    req.session.username = JSON.stringify(
                      `${data.alias.first}-${data.alias.last}`
                    );

                    res.setHeader("Content-Type", "text/html");

                    console.log(
                      `Session saved: \nSession: ${JSON.stringify(
                        req.session,
                        null,
                        2
                      )}\nSession Username: ${req.session.username}`
                    );
                  } catch (err) {
                    console.log(`Session Add Error: ${err}`);
                  }

                  res.send("Success");
                  res.end();

                  //Send emails
                  //new Send_Mail(data);
                })
                .catch(function (err) {
                  console.log(`Error: ${err}`);
                });
            } else {
              console.log(`Found data in database, not adding`);

              res.json("Username Taken");
              res.end();
            }
          } else {
            res.json("Root User Already Created!");
            res.end();
          }
        })
        .catch(function (err) {
          console.log(`Error: ${JSON.stringify(err, null, 2)}`);
        });
    });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

router.post("/login", (req, res) => {
  try {
    console.log(`Username: ${req.body.username} Password: ${req.body.password}`)

    var main_db = new PouchDB(
      `http://${process.env.host}:${process.env.port}/database/data`
    );

    main_db.info().then(function (info) {
      console.log(`Info: ${JSON.stringify(info)}`);

      main_db
        .get("Main")
        .then(function (result) {
          console.log(`Main: ${JSON.stringify(result, null, 2)}`);

          for (let user of Object.values(result.users)) {
            if (user.username === req.body.username) {
              if (user.password === req.body.password) {
                if (user.is_admin === true) {
                  res.json({ username: req.body.username, is_admin: true, is_loggedin: true });
                  res.end();
                } else {
                  res.json({ username: req.body.username, is_admin: false, is_loggedin: true });
                  res.end();
                }
              } else {
                res.json({
                  username: null,
                  is_admin: null,
                  loginError: "Credientials",
                });
                res.end();
              }
            } else {
              res.json({
                username: null,
                is_admin: null,
                loginError: "Credientials",
              });
              res.end();
            }
          }
        })
        .catch(function (err) {
          console.log(`Error: ${JSON.stringify(err, null, 2)}`);
        });
    });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

export default router;
