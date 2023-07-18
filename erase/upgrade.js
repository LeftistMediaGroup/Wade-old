// Allow require
import { createRequire } from "module";

import * as dotenv from "dotenv";
import { error } from "console";

dotenv.config();

//End require
const require = createRequire(import.meta.url);

var PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-authentication"));

let database = new PouchDB(
  `http://${process.env.host}:${process.env.port}/database/data`
);

database
  .signUpAdmin(process.env.admin_username, process.env.admin_password)
  .then(function (response) {
    console.log(`Response: ${response}`);
  })
  .catch(function (err) {
    console.log(err);
  });
