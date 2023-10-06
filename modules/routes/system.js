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

import { createAvatar } from "@dicebear/core";
import { bottts } from "@dicebear/collection";

var path = require("path");
const { __dirname } = require("path");

dotenv.config();
router.put("/register_user", (req, res) => {
  try {
    let password = req.body.password;
    let email = req.body.email;

    let first = chance.first();
    let last = chance.last();

    let username = `${first}-${last}-${chance.integer({ min: 1, max: 99 })}`;

    let avatar = createAvatar(bottts, {
      baseColor: [
        "00acc1",
        "1e88e5",
        "5e35b1",
        "6d4c41",
        "7cb342",
        "8e24aa",
        "0039be5",
        "43a047",
        "546e7a",
        "00897b",
        "3949ab",
        "757575",
        "c0ca33",
        "d81b60",
        "e53935",
        "f4511e",
        "fb8c00",
        "fdd835",
        "ffb300",
      ],
      eyes: [
        "bulging",
        "dizzy",
        "eva frame1",
        "frame2 glow",
        "happy hearts",
        "robocop round",
        "roundFrame01",
        "roundFrame02",
        "sensor",
        "shade01",
      ],
      face: [
        "round01",
        "round02",
        "square01",
        "square02",
        "square03",
        "square04",
      ],
      mouth: [
        "bite",
        "diagram",
        "grill01",
        "grill02",
        "grill03",
        "smile01",
        "smile02",
        "square01",
        "square02",
      ],
      sides: ["antenna01", "antenna02"],
      top: ["radar"],
    });

    let avatarPath = `${require("path").resolve(
      "./"
    )}/public/avatars/${username}-avatar.svg`;
    avatar.toFile(avatarPath);

    let registerTime = strftime("%y%m%d_%X");

    let data = {
      _id: username,
      first: first,
      last: last,
      username: username,
      password: password,
      email: email,
      registerTime: registerTime,
      avatar: `http://${process.env.host}:${process.env.port}/public/${username}.svg`,
      conversations: {
        [username]: {
          conversationName: `${username}-${username}`,
          name: username,
          lastSenderName: username,
          info: "This is the first message in your conversation with yourself",
          messages: {
            [username]: {
              message:
                "This is the first message in your conversation with yourself",
              sentTime: registerTime,
              sender: username,
              direction: "incoming",
              avatarLink: avatar,
            },
          },
          unreadCnt: 1,
          avatarLink: avatar,
          unreadDot: true,
          lastActivityTime: registerTime,
        },
      },
      contacts: { [username]: { username: username } },
      discussions: {},
      tasks: {},
      files: {},
      is_admin: false,
    };

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
              .then(() => {
                var user_db = new PouchDB(
                  `http://${process.env.host}:${process.env.port}/database/users`
                );

                user_db.info().then(() => {
                  user_db.put(data);
                });
              })
              .then(function () {
                try {
                  req.session.username = username;

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

    let avatar = createAvatar(bottts, {
      baseColor: [
        "00acc1",
        "1e88e5",
        "5e35b1",
        "6d4c41",
        "7cb342",
        "8e24aa",
        "0039be5",
        "43a047",
        "546e7a",
        "00897b",
        "3949ab",
        "757575",
        "c0ca33",
        "d81b60",
        "e53935",
        "f4511e",
        "fb8c00",
        "fdd835",
        "ffb300",
      ],
      eyes: [
        "bulging",
        "dizzy",
        "eva frame1",
        "frame2 glow",
        "happy hearts",
        "robocop round",
        "roundFrame01",
        "roundFrame02",
        "sensor",
        "shade01",
      ],
      face: [
        "round01",
        "round02",
        "square01",
        "square02",
        "square03",
        "square04",
      ],
      mouth: [
        "bite",
        "diagram",
        "grill01",
        "grill02",
        "grill03",
        "smile01",
        "smile02",
        "square01",
        "square02",
      ],
      sides: ["antenna01", "antenna02"],
      top: ["radar"],
    });

    let avatarPath = `${require("path").resolve(
      "./"
    )}/public/avatars/${username}-avatar.svg`;
    avatar.toFile(avatarPath);

    let registerTime = strftime("%y%m%d_%X");

    let data = {
      _id: username,
      first: first,
      last: last,
      username: username,
      password: password,
      email: email,
      registerTime: registerTime,
      avatar: `http://${process.env.host}:${process.env.port}/public/${username}.svg`,
      conversations: {
        [username]: {
          conversationName: `${username}-${username}`,
          name: username,
          lastSenderName: username,
          info: "This is the first message in your conversation with yourself",
          messages: {
            [username]: {
              message:
                "This is the first message in your conversation with yourself",
              sentTime: registerTime,
              sender: username,
              direction: "incoming",
              avatarLink: avatar,
            },
          },
          unreadCnt: 1,
          avatarLink: avatar,
          unreadDot: true,
          lastActivityTime: registerTime,
        },
      },
      contacts: { [username]: { username: username } },
      discussions: {},
      tasks: {},
      files: {},
      is_admin: true,
    };

    var main_db = new PouchDB(
      `http://${process.env.host}:${process.env.port}/database/data`
    );

    main_db.info().then(function (info) {
      main_db
        .get("Main")
        .then(function (result) {
          if (result.admin_created === false) {
            if (!JSON.stringify(result).includes(email)) {
              result.users[username] = data;
              result.admin_created = true;

              main_db
                .put(result)
                .then(() => {
                  var user_db = new PouchDB(
                    `http://${process.env.host}:${process.env.port}/database/users`
                  );

                  user_db.info().then(() => {
                    user_db.put(data);
                  });
                })
                .then(function () {
                  try {
                    req.session.username = username;

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
    var main_db = new PouchDB(
      `http://${process.env.host}:${process.env.port}/database/data`
    );

    main_db.info().then(function (info) {
      main_db
        .get("Main")
        .then(function (result) {
          let usersnum = Object.values(result.users).length;
          let passwordspassed = 0;

          Object.values(result.users).forEach((user, userspassed) => {
            if (user.username === req.body.username) {
              if (user.password === req.body.password) {
                if (user.is_admin === true) {
                  req.session.username = req.body.username;
                  res.json({
                    username: req.body.username,
                    is_admin: true,
                    is_loggedin: true,
                  });
                  res.end();
                } else {
                  req.session.username = req.body.username;
                  res.json({
                    username: req.body.username,
                    is_admin: false,
                    is_loggedin: true,
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
            } else {
              if (userspassed + 1 === usersnum) {
                res.json({
                  username: null,
                  is_admin: null,
                  loginError: "Credientials",
                });
                res.end();
              }
            }
          });
        })
        .catch(function (err) {
          console.log(`Error: ${JSON.stringify(err, null, 2)}`);
        });
    });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

router.get("/admin_created", (req, res) => {
  var main_db = new PouchDB(
    `http://${process.env.host}:${process.env.port}/database/data`
  );

  main_db.info().then(function (info) {
    console.log(`Info: ${JSON.stringify(info)}`);

    main_db.get("Main").then(function (result) {
      console.log(`Main: ${JSON.stringify(result, null, 2)}`);
      if (result.admin_created === false) {
        res.json({ admin_created: false });
        res.end();
      } else {
        res.json({ admin_created: true });
        res.end();
      }
    });
  });
});

export default router;
