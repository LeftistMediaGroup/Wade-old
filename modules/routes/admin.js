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

router.get("/user_profiles", (req, res) => {
  try {
    var main_db = new PouchDB(
      `http://${process.env.host}:${process.env.port}/database/data`
    );

    main_db.info().then(function (info) {
      main_db.get("Main").then((result) => {
        let dataOut = [];

        Object.values(result.users).forEach((user) => {
          dataOut.push({
            username: user.username,
            is_admin: user.is_admin,
            registerTime: user.registerTime,
            email: user.email,
            tasks: user.tasks,
            files: user.files,
          });
        });

        res.json({ userProfiles: dataOut });
      });
    });
  } catch (err) {
    console.log(`Error: ${error}`);
  }
});

export default router;
